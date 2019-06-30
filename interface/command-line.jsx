class CommandLine extends React.Component {
  constructor(props) { // expecting render (bool), onShowElement (handler function) and onClose (handler function)
    super(props);
    this.state = {
      input_value: "",
    }
    this.cmd_line = React.createRef();
    this.searchInput = React.createRef();
    this.height = "0px";
    this.onTransition = this.onTransition.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.keyDown = this.keyDown.bind(this);
    this.renderStatus = this.renderStatus.bind(this);
  }
  onTransition() {
    if (this.height == "0px") {
      this.isActive = false;
      this.forceUpdate();
    }
  }
  onValueChange(event) {
    this.setState({
      input_value: event.target.value
    })
  }
  keyDown(event) {
    this.props.onClose("InfoToast");
    if (!event.shiftKey && event.key == "Enter") {
      let success = true;
      let args = this.state.input_value.toLowerCase().split(" ");
      let command = args.shift();

      switch (command) {
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
        case "speed":
          if (args[0] > 0 && args[0] <= 30) {
            game.updateSpeed(args[0]);
          } else {
            this.renderStatus("error", "New speed value is not valid or doesn't exist, it must be a value between 0 and 30")
            success = false;
          }
          break;
        default:
          this.renderStatus("error", "The command doesn't exist")
          success = false;
      }
      if (success) {
        event.target.value = ""
        this.setState({ input_value : event.target.value })
        this.renderStatus("info", "Command successfully executed: " + command);
      }
    }
  }
  renderStatus(type, message) {
    this.props.onShowElement("InfoToast", {type: type, message: message});
  }
  componentWillUpdate(newProps) { // newProps are updated props, this.props are old ones
    if (newProps.render) {
      this.isActive = true;
      if (this.height == "0px") {
        setTimeout(() => {
          this.height = "120px";
          this.forceUpdate();
        }, 0)
      }
    } else {
      this.height = "0px";
    }
  }
  componentDidUpdate() {
    this.cmd_line.current != null ? this.cmd_line.current.focus() : null; // had to use this instead of autofocus cuz it wouldnt focus it when the component is already shown
  }
  render() {
    if (this.isActive) {
      return (
        <div id="search_container" className="cmd_line" style={{ height: this.height }} onTransitionEnd={this.onTransition}>
          <input type="text" id="cmd_line" className="input_standard" ref={this.cmd_line} style={{ margin: "30px 0 0 0" }} onChange={this.onValueChange} onKeyDown={this.keyDown} wrap="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" placeholder="Enter command here.."/>
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