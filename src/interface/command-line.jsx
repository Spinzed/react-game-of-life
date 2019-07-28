import React from "react";
import Cookie from "js-cookie";

export default class CommandLine extends React.Component {
  constructor(props) { // expects render (bool), game (Game object), onShowElement (handler) and onClose (handler)
    super(props);
    this.state = {
      input_value: "",
      suggestionBox: false
    }
    this.cmd_line = React.createRef();
    this.height = 0;
    this.onTransition = this.onTransition.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.keyDown = this.keyDown.bind(this);
    this.renderStatus = this.renderStatus.bind(this);
  }
  onValueChange(event) { // triggers on input field value change 
    this.setState({ input_value: event.target.value });
    this.props.onClose("InfoToast");

    if (event.target.value !== "") { // make sure not to use the value from state
      this.setState({ suggestionBox: true });
    } else {
      this.setState({ suggestionBox: false });
    }
  }
  keyDown(event) { // triggers on key pressed in input field
    if (!event.shiftKey && event.key === "Enter") {
      if (event.target.value === "") return;
      let renderSuccess = true;
      let command = this.parse_input_value().command;
      let args = this.parse_input_value().args;

      switch (command) { // TODO: rerite this using commands.json (maybe?)
        case "new":
          this.props.onShowElement("NewGamePrompt"); // calls the handler
          break;
        case "reset":
        case "restart":
          this.props.game.restart();
          break;
        case "stop":
        case "pause":
        case "freeze":
          this.props.game.stop();
          break;
        case "start":
        case "continue":
          this.props.game.continue();
          break;
        case "seed":
          this.renderStatus("info", "Seed: " + this.props.game.seed);
          renderSuccess = false;
          event.target.value = ""
          this.setState({ input_value: event.target.value })
          break;
        case "speed":
          if (args[0] > 0 && args[0] <= 50) {
            this.props.game.setSpeed(parseInt(args[0]));
          } else {
            this.renderStatus("error", "New speed value is not valid or doesn't exist, it must be a value between 0 and 50")
            renderSuccess = false;
          }
          break;
        default:
          this.renderStatus("error", "The command doesn't exist")
          renderSuccess = false;
      }
      if (renderSuccess) {
        event.target.value = ""
        this.setState({ input_value : event.target.value })
        this.renderStatus("info", "Command successfully executed: " + command);
      }
      if (event.target.value !== "") { // make sure not to use the value from state
        this.setState({ suggestionBox: true });
      } else {
        this.setState({ suggestionBox: false });
      }
    }
  }
  renderStatus(type, message) {
    this.props.onShowElement("InfoToast", {type: type, message: message});
  }
  onTransition() {
    if (this.height === 0) { // just hides the component when css animation finishes
      this.isShown = false;
      this.forceUpdate();
    }
  }
  shouldComponentUpdate(nextProps, nextState) { // prevent unnecesarry rerenders
    if (this.isShown) this.cmd_line.current.focus(); // focus on every component rerender
    if (this.props !== nextProps ||
      this.state.suggestionBox !== nextState.suggestionBox ||
      nextState.suggestionBox) { // this.state and nexState are always False, different object references?
      return true;
    }
    return false;
  }
  componentWillUpdate(nextProps, nextState) { // newProps are updated props, this.props are old ones
    if (nextProps.render) {
      if (Cookie.get("help_stage") < "3") {
        setTimeout(() => {
          this.props.onShowElement("InfoToast", { type: "info", message: "Enter \"help\" to browse through all commands" });
          Cookie.set("help_stage", "3");
        }, 1000)
      }
      this.isShown = true; // indicates if the component is shown
    } else {
      if (this.height !== 0) {
        this.setState({ suggestionBox: false });
        this.props.onClose("InfoToast");
      }
      this.height = 0; // if the component should hide, triggers the animation, when finished, it triggers onTransition handler
    }
  }
  componentDidUpdate() {
    if (this.isShown) {
      this.cmd_line.current.value = this.state.input_value;
      this.cmd_line.current.focus(); // had to use this instead of autofocus cuz it wouldnt focus it when the component is already shown
    }
    if (this.props.render) {
      if (this.height === 0) { // ..but it shouldnt work without timeout?..
        this.height = 120;
        this.forceUpdate();
      }
    }
  }
  render() {
    let outer_height = this.height - 45;
    if (outer_height < 0) outer_height = 0;
    if (this.isShown) {
      return (
        <div id="search_container" className="cmd_line center_absolute" style={{ height: this.height + "px"}} onTransitionEnd={this.onTransition}>
          <div id="cmd_line_outer" className="cmd_line_outer overflow" style={{ height: outer_height + "px" }}>
            <input type="text" id="cmd_line" className="input_standard dark" ref={this.cmd_line} style={{ margin: "35px 0 0 0" }} onChange={this.onValueChange} onKeyDown={this.keyDown} wrap="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" autoComplete="off" placeholder="Enter command here.." />
          </div>
          <SuggestionBox render={this.state.suggestionBox} search_query={this.parse_input_value()}/>
        </div>
      )
    } else return null;
  }
  parse_input_value(value = this.state.input_value) {
    let args = value.toLowerCase().trimRight().split(" ").filter(arg => arg !== ""); // splits the args and removes trailing empty strings
    let command = args.shift(); // take the first argument of args and put set it as command
    return { command, args };
  }
}

class SuggestionBox extends React.Component {
  constructor(props) { // expects render (bool) and search_query (string)
    super(props);
    fetch("./src/interface/commands.json")
    .then((response) => {
      console.log(response)
      return response.json();
    })
    .then((response) => {
      let map = new Map(); // sort the response array
      response.forEach(command => map.set(command.name, command));
      let mapSorted = new Map([...map.entries()].sort());
      let sortedCommands = [];
      mapSorted.forEach(command => sortedCommands.push(command));
      this.commands = response;
    })
    .catch((response) => {
      console.error("Error fetching commands.json: " + response)
    })
    this.text_colors = {
      written: "#00b7ff",
      mistaken: "#ff7a7a",
      unreached: "#b3b3b3"
    }
  }
  componentWillUpdate(nextProps, nextState) {
    if (!nextProps.render) return; // prevents stuff from doing if it doesnt have to
    this.suggestions = [];
    this.command = nextProps.search_query.command;
    this.args = nextProps.search_query.args;

    this.commands.map(command_obj => {
      command_obj.aliases.forEach(alias => {
        if (this.command === alias) {
          let suggestion = {
            written: "",
            mistaken: "",
            unreached: ""
          };
          suggestion.written = this.command;
          command_obj.args.map((cmd_obj_arg, index) => {
            if (this.args[index] !== undefined) {
              let parsed_arg = parseInt(this.args[index]);
              if (isNaN(parsed_arg)) parsed_arg = this.args[index];
              if (typeof(parsed_arg) === this.getArgType(cmd_obj_arg)) {
                suggestion.written += " " + cmd_obj_arg;
              } else {
                suggestion.mistaken += " " + cmd_obj_arg;
              }
            } else {
              suggestion.unreached += " " + cmd_obj_arg;
            }
            return cmd_obj_arg;
          })
          this.suggestions.push(suggestion);
        } else if (this.command === alias.slice(0, this.command.length)) {
          let suggestion = {
            written: "",
            mistaken: "",
            unreached: ""
          };
          suggestion.written = this.command;
          suggestion.unreached = alias.slice(this.command.length, alias.length)
          this.suggestions.push(suggestion);
        }
      });
      return command_obj; //eslint
    });
  }
  render() {
    // if (this.command === "stop") { // this is a test, will get removed and used in CommandLine component
    //   let func = new Function(this.commands[0].command); // I could've used eval() too
    //   func();
    // } 
    if (this.props.render) {
      return (
        <div id="cmd_suggestion_box" className="cmd_suggestion_box center_absolute">
          <ul>
            {
              this.suggestions.map((suggestion, index) => (
                <li key={index}>
                  <div className="margin">
                    <div>
                      <span style={{ color: this.text_colors.written }}>{suggestion.written}</span>
                      <span style={{ color: this.text_colors.mistaken }}>{suggestion.mistaken}</span>
                      <span style={{ color: this.text_colors.unreached }}>{suggestion.unreached}</span>
                    </div>
                    <div>
                      <span></span>
                    </div>
                  </div>
                </li>
              ))
            }
          </ul>
        </div>
      )
    } else return null;
  }

  getArgType(arg) {
    let start = arg[0];
    let end = arg[arg.length - 1]
    if (start === "<" && end === ">") {
      return "number";
    } else if (start === "[" && end === "]") {
      return "string";
    } else {
      throw new Error("Error: unknown argument type");
    }
  }
}

// eslint-disable-next-line no-unused-vars
class CommandLineStatus extends React.Component { // old unused component, kept for just in case
  constructor(props) { // expects render (bool), status (string) and message (string)
    super(props);
    this.opacity = "0";
  }
  render() {
    if (this.props.render && this.opacity === "0") {
      setTimeout(() => {
        this.opacity = "1";
        this.forceUpdate();
      }, 0)
    } else if (!this.props.render) {
      this.opacity = "0";
    }
    if (this.props.render) {
      this.props.status === "error" ? this.color = "#d13c3c" : this.color = "#1933b7";
      return (
        <div id="error" className="cmd_status" style={{ opacity: this.opacity, color: this.color }}>{( this.props.message )}</div>
      )
    } else return null;
  }
}