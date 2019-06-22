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
        this.props.onClose();
        return;
      }
      let seed = int(this.state.input_value);
      console.log(seed)
      if (isNaN(seed) || seed == Infinity) {
        console.log("Not a valid number");
        return;
      }
      game.newGame(seed);
      this.props.onClose();
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
          <input type="text" id="seed" className="cmd_line" onChange={this.onValueChange} onKeyDown={this.keyDown} autoFocus wrap="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"/>
        </div>
      )
    } else return null;
  }
}