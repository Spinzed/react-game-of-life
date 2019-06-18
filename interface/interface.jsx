class Interface extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commandLine: false
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", () => {
      if (!this.state.commandLine) {
        if (event.key == "Enter" && !event.shiftKey) {
          this.setState({ commandLine: true });
        }
      } else {
        if (event.key == "Escape" || event.key == "Enter" && event.shiftKey) {
          this.setState({ commandLine: false });
        }
      }
    });
  }

  render() {
    return (
      <div id="components">
        <CommandLine render={this.state.commandLine} />
      </div>
    );
  }
}