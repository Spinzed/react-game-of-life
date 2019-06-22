class CommandLine extends React.Component {
  constructor(props) { // expecting render (bool) and onNewGame (handler function)
    super(props);
    this.state = {
      input_value: "",
      status_render: false,
      status_type: "",
      status_message: ""
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
    clearTimeout(this.statusRemoveTimeout);
    this.setState({ status_render: false });
    if (!event.shiftKey && event.key == "Enter") {
      let success = true;
      let args = this.state.input_value.split(" ");
      let command = args.shift();

      switch (command) {
        case "new":
          this.props.onNewGame(); // calls a handler
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
        this.renderStatus("status", "Command successfully executed: " + command)
      }
    }
  }
  renderStatus(type, message) {
    this.setState({
      status_render: true,
      status_type: type,
      status_message: message
    })
    if (type == "status") {
      this.statusRemoveTimeout = setTimeout(() => {
        this.setState({
          status_render: false,
        })
      }, 5000);
    }
  }
  componentDidUpdate() {
    this.cmd_line.current != null ? this.cmd_line.current.focus() : null; // had to use this instead of autofocus cuz it wouldnt focus it when the component is already shown
  }
  render() {
    if (this.props.render) {
      this.isActive = true;
    } else {
      this.height = "0px";
    }
    if (this.isActive && this.height == "0px" && this.props.render) {
      setTimeout(() => {
        this.height = "120px";
        this.forceUpdate();
      }, 0)
    }
    // ^^ this code above updates css thingys
    if (this.isActive) {
      return (
        <div id="search_container" className="search" style={{ height: this.height }} onTransitionEnd={this.onTransition}>
          <input type="text" ref={this.cmd_line} style={{ margin: "30px 0 0 0" }} id="cmd_line" className="cmd_line" onChange={this.onValueChange} onKeyDown={this.keyDown} wrap="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" placeholder="Enter command here.."/>
          <CommandLineStatus render={this.state.status_render} status={this.state.status_type} message={this.state.status_message} />
        </div>
      )
    } else return null;
  }
}

class CommandLineStatus extends React.Component {
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