class CommandLine extends React.Component {
  constructor(props) { // expecting render (bool), onShowElement (handler function) and onClose (handler function)
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

    if (event.target.value != "") { // make sure not to use the value from state
      this.setState({ suggestionBox: true });
    } else {
      this.setState({ suggestionBox: false });
    }
  }
  keyDown(event) { // triggers on key pressed in input field
    if (!event.shiftKey && event.key == "Enter") {
      let renderSuccess = true;
      let command = this.parse_input_value().command;
      let args = this.parse_input_value().args;

      switch (command) { // TODO: rerite this using commands.json (maybe?)
        case "new":
          this.props.onShowElement("NewGamePrompt"); // calls the handler
          break;
        case "reset":
        case "restart":
          game.restart();
          break;
        case "stop":
        case "pause":
          game.stop();
          break;
        case "start":
        case "continue":
          game.continue();
          break;
        case "seed":
          this.renderStatus("info", "Seed: " + game.seed);
          renderSuccess = false;
          event.target.value = ""
          this.setState({ input_value: event.target.value })
          break;
        case "speed":
          if (args[0] > 0 && args[0] <= 30) {
            game.updateSpeed(args[0]);
          } else {
            this.renderStatus("error", "New speed value is not valid or doesn't exist, it must be a value between 0 and 30")
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
      if (event.target.value != "") { // make sure not to use the value from state
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
    if (this.height == 0) { // just hides the component when css animation finishes
      this.isShown = false;
      this.forceUpdate();
    }
  }
  shouldComponentUpdate(nextProps, nextState) { // prevent unnecesarry rerenders
    if (this.props != nextProps ||
      this.state.suggestionBox != nextState.suggestionBox ||
      nextState.suggestionBox) {
      return true;
    }
    return false;
  }
  componentWillUpdate(nextProps, nextState) { // newProps are updated props, this.props are old ones
    if (nextProps.render) {
      this.isShown = true; // indicates if the component is shown
    } else {
      this.height = 0; // if the component should hide, triggers the animation, when finished, it triggers onTransition handler
      this.setState({ suggestionBox: false });
      this.props.onClose("InfoToast");
    }
  }
  componentDidUpdate() {
    if (this.isShown) {
      this.cmd_line.current.value = this.state.input_value;
      this.cmd_line.current.focus(); // had to use this instead of autofocus cuz it wouldnt focus it when the component is already shown
    }
    if (this.props.render) {
      if (this.height == 0) { // ..but it shouldnt work without timeout?..
        this.height = 120;
        this.forceUpdate();
      }
    }
  }
  render() {
    let outer_height = this.height - 45;
    outer_height < 0 ? outer_height = 0 : null;
    if (this.isShown) {
      return (
        <div id="search_container" className="cmd_line center_absolute" style={{ height: this.height + "px"}} onTransitionEnd={this.onTransition}>
          <div id="cmd_line_outer" className="cmd_line_outer overflow" style={{ height: outer_height + "px" }}>
            <input type="text" id="cmd_line" className="input_standard" ref={this.cmd_line} style={{ margin: "35px 0 0 0" }} onChange={this.onValueChange} onKeyDown={this.keyDown} wrap="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" autoComplete="off" placeholder="Enter command here.." />
          </div>
          <SuggestionBox render={this.state.suggestionBox} search_query={this.parse_input_value()}/>
        </div>
      )
    } else return null;
  }
  parse_input_value(value = this.state.input_value) {
    let args = value.toLowerCase().split(" ").filter(arg => arg != ""); // splits the args and removes trailing empty strings
    let command = args.shift(); // take the first argument of args and put set it as command
    return { command, args };
  }
}

class SuggestionBox extends React.Component {
  constructor(props) { // expects render (bool) and search_query (string)
    super(props);
    fetch("./interface/commands.json").then((response) => {
      return response.json();
    })
    .then((response) => {
      this.commands = response;
    })
    .catch((response) => {
      console.error("Error fetching commands.json: " + response)
    })
    this.text_colors = {
      written: "#00b7ff",
      mistaken: "red",
      unreached: "#b3b3b3"
    }
  }
  componentWillUpdate(nextProps, nextState) {
    if (!nextProps.render) return;
    this.suggestions = [];
    this.command = nextProps.search_query.command;
    this.args = nextProps.search_query.args;

    this.commands.map((command_obj, index) => {
      if (this.command == command_obj.name) {
        let suggestion = {
          written: "",
          mistaken: "",
          unreached: ""
        };
        suggestion.written = this.command;
        command_obj.args.map((arg, index) => {
          if (this.args[index] != undefined) {
            suggestion.written += " " + arg;
          } else {
            suggestion.unreached += " " + arg;
          }
        })
        this.suggestions.push(suggestion);
      } else if (this.command == command_obj.name.slice(0, this.command.length)) {
        let suggestion = {
          written: "",
          mistaken: "",
          unreached: ""
        };
        suggestion.written = this.command;
        suggestion.unreached = command_obj.name.slice(this.command.length, command_obj.name.length)
        this.suggestions.push(suggestion);
      }
    });
  }
  render() {
    // if (this.command == "stop") { // this is a test, will get removed and used in CommandLine component
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
                    <span style={{ color: this.text_colors.written }}>{suggestion.written}</span>
                    <span style={{ color: this.text_colors.mistaken }}>{suggestion.mistaken}</span>
                    <span style={{ color: this.text_colors.unreached }}>{suggestion.unreached}</span>
                  </div>
                </li>
              ))
            }
          </ul>
        </div>
      )
    } else return null;
  }
}

class CommandLineStatus extends React.Component { // old unused component, kept for just in case
  constructor(props) { // expects render (bool), status (string) and message (string)
    super(props);
    this.opacity = "0";
  }
  render() {
    if (this.props.render && this.opacity == "0") {
      setTimeout(() => {
        this.opacity = "1";
        this.forceUpdate();
      }, 0)
    } else if (!this.props.render) {
      this.opacity = "0";
    }
    if (this.props.render) {
      this.props.status == "error" ? this.color = "#d13c3c" : this.color = "#1933b7";
      return (
        <div id="error" className="cmd_status" style={{ opacity: this.opacity, color: this.color }}>{( this.props.message )}</div>
      )
    } else return null;
  }
}