class Interface extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commandLine: false,
      newGamePrompt: false,
      infoToast: false
    }
    this.showElement = this.showElement.bind(this);
    this.hideElement = this.hideElement.bind(this);
  }
  componentDidMount() {
    document.addEventListener("keydown", () => {
      if (game.isFrozen) return;
      if (!this.state.commandLine) {
        if (event.key == "Enter" && !event.shiftKey) {
          this.showElement("CommandLine");
        }
      } else {
        if (event.key == "Enter" && !event.shiftKey) {
          this.showElement("CommandLine"); // focus cmnd line if not focused
        }
        if (event.key == "Escape" || event.key == "Enter" && event.shiftKey) {
          this.hideElement("CommandLine");
        }
      }
    });
  }
  showElement(element, props = undefined) { // props to pass down are optional, they dont have to exist
    if (element == "CommandLine") {
      if (!this.state.commandLine) this.setState({ commandLine: true });
    } else if (element == "NewGamePrompt") {
      game.isFrozen = true;
      if (!this.state.newGamePrompt) this.setState({ newGamePrompt: true });
    } else if (element == "InfoToast") {
      this.infoToastType = props.type;
      this.infoToastMessage = props.message;
      if (!this.state.infoToast) this.setState({ infoToast: true });
    } else {
      throw "Invalid element";
    }
  }
  hideElement(element) {
    if (element == "CommandLine") {
      if (this.state.commandLine) this.setState({ commandLine: false });
    } else if (element == "NewGamePrompt") {
      game.isFrozen = false;
      if (this.state.newGamePrompt) this.setState({ newGamePrompt: false });
    } else if (element == "InfoToast") {
      if (this.state.infoToast) this.setState({ infoToast: false });
    } else {
      throw "Invalid element";
    }
  }
  
  render() {
    return (
      <div id="components">
        <CommandLine render={this.state.commandLine} onShowElement={this.showElement} onClose={this.hideElement}/>
        <NewGamePrompt render={this.state.newGamePrompt} onClose={this.hideElement}/>
        <InfoToast render={this.state.infoToast} type={this.infoToastType} message={this.infoToastMessage} onClose={this.hideElement}/>
      </div>
    );
  }
}