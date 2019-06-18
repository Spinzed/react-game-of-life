class CommandLine extends React.Component {
  constructor(props) { // expecting render (bool)
    super(props);
    this.state = {
      input: "",
      error: false,
      error_message: ""
    }
    this.searchInput = React.createRef();
    this.height = "0px";
    this.onTransition = this.onTransition.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.keyDown = this.keyDown.bind(this);
  }
  onTransition() {
    if (this.height == "0px") {
      this.isActive = false;
      this.forceUpdate();
    }
  }
  onValueChange(event) {
    this.setState({
      input: event.target.value
    })
  }
  keyDown(event) {
    this.setState({ error: false });
    if (!event.shiftKey && event.key == "Enter") {
      let reset = true;
      let args = event.target.value.split(" ");
      let command = args.shift();

      switch (command) {
        case "reset":
        case "restart":
          game.restart();
          break;
        case "stop":
        case "pause":
          game.stop();
          break;
        case "start":
          game.start();
          break;
        case "continue":
          game.continue();
          break;
        case "speed":
          if (args[0] > 0 && args[0] <= 30) {
            game.updateSpeed(args[0]);
          } else {
            this.setState({ 
              error: true,
              error_message: "New speed value is not valid or doesn't exist, it must be a value between 0 and 30"
            });
            reset = false;
          }
          break;
        default:
          this.setState({
            error: true,
            error_message: "The command doesnt exist"
          });
          reset = false;
      }
      if (reset) {
        event.target.value = "";
      }
    }
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
        <div id="search_container" className="search" style={{ height: this.height }} onTransitionEnd={ this.onTransition }>
          <input id="search" type="text" className="input" autoFocus onChange={ this.onValueChange } onKeyDown={ this.keyDown } wrap="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" placeholder="Enter command here.."></input>
          <CommandLineError render={ this.state.error } message={ this.state.error_message }/>
        </div>
      )
    } else return null;
  }
}

class CommandLineError extends React.Component {
  constructor(props) { // expects render (bool) and message (string)
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
      return (
        <div id="error" className="error" style={{opacity: this.opacity}}>{(this.props.message)}</div>
      )
    } else return null;
  }
}