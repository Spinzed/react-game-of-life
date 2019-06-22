class Interface extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commandLine: false,
      newGamePrompt: false
    }
    this.openNewGamePrompt = this.openNewGamePrompt.bind(this);
    this.closeNewGamePrompt = this.closeNewGamePrompt.bind(this);
  }
  componentDidMount() {
    document.addEventListener("keydown", () => {
      if (game.isFrozen) return;
      if (!this.state.commandLine) {
        if (event.key == "Enter" && !event.shiftKey) {
          this.setState({ commandLine: true });
        }
      } else {
        if (event.key == "Enter" && !event.shiftKey) {
          this.setState({ commandLine: true }); // focus cmmd line if not focused
        }
        if (event.key == "Escape" || event.key == "Enter" && event.shiftKey) {
          this.setState({ commandLine: false });
        }
      }
    });
  }
  openNewGamePrompt() {
    game.isFrozen = true;
    this.setState({
      newGamePrompt: true
    });
  }
  closeNewGamePrompt() {
    game.isFrozen = false;
    this.setState({
      newGamePrompt: false
    });
  }
  render() {
    return (
      <div id="components">
        <CommandLine render={this.state.commandLine} onNewGame={this.openNewGamePrompt}/>
        <NewGamePrompt render={this.state.newGamePrompt} onClose={this.closeNewGamePrompt} />
      </div>
    );
  }
}