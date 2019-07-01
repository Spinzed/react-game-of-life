class NewGamePrompt extends React.Component {
  constructor(props) { // expects render (bool) and onClose (handler function)
    super(props);
    this.state = ({
      input_value: ""
    });
    this.onValueChange = this.onValueChange.bind(this);
    this.keyDown = this.keyDown.bind(this);
  }
  onValueChange(event) {
    this.setState({
      input_value: event.target.value
    })
  }
  keyDown() {
    if (event.key == "Enter" && !event.shiftKey) {
      if (this.state.input_value == "") {
        this.props.onClose("NewGamePrompt");
        return;
      }
      let seed = int(this.state.input_value);
      if (isNaN(seed) || seed == Infinity) {
        console.log("Not a valid number");
        return;
      }
      game.newGame(seed);
      this.props.onClose("NewGamePrompt");
      console.log("valid number");
    }
    if (event.key == "Escape") {
      this.props.onClose();
    }
  }
  render(){
    if (this.props.render) {
      return (
        <div id="new_game_prompt" className="new_game_prompt">
          <div>Set the seed</div>
          <input type="text" id="seed" className="input_standard" onChange={this.onValueChange} onKeyDown={this.keyDown} autoFocus wrap="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" autoComplete="off"/>
        </div>
      )
    } else return null;
  }
}