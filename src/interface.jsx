import React from "react";
import Cookie from "js-cookie";
import CommandLine from './interface/command-line.jsx';
import InfoToast from './interface/info-toast.jsx';
import NewGamePrompt from './interface/new-game-prompt.jsx';
import { Game as game } from './game.js';

export default class Interface extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commandLine: false,
      newGamePrompt: false,
      infoToast: false
    }
    this.showElement = this.showElement.bind(this);
    this.hideElement = this.hideElement.bind(this);
    if (Cookie.get("help_stage") === undefined) {
      setTimeout(() => {
        this.showElement("InfoToast", { type: "info", message: "Press Enter to show the Command Line" });
        Cookie.set("help_stage", "1");
      }, 3000)
    }    
  }
  componentDidMount() {
    game.start();
    document.addEventListener("keydown", (event) => {
      if (game === undefined) return; // this prevents errors if Enter is pressed before all js is loaded
      if (game.isFrozen) return;
      if (!this.state.commandLine) {
        if (event.key === "Enter" && !event.shiftKey) {
          if (Cookie.get("help_stage") === "1") Cookie.set("help_stage", "2");
          this.showElement("CommandLine");
        }
      } else {
        if (event.key === "Enter" && !event.shiftKey) {
          this.showElement("CommandLine"); // focus cmd line if not focused
        }
        if (event.key === "Escape" || (event.key === "Enter" && event.shiftKey)) {
          this.hideElement("CommandLine");
        }
      }
    });
  }
  showElement(element, props = undefined) { // props to pass down are optional, they dont have to exist
    if (element === "CommandLine") {
      this.setState({ commandLine: true });
    } else if (element === "NewGamePrompt") {
      game.isFrozen = true;
      this.setState({ newGamePrompt: true });
    } else if (element === "InfoToast") {
      this.infoToastType = props.type;
      this.infoToastMessage = props.message;
      this.setState({ infoToast: true });
    } else {
      throw new Error("Invalid element");
    }
  }
  hideElement(element) {
    if (element === "CommandLine") {
      this.setState({ commandLine: false });
    } else if (element === "NewGamePrompt") {
      game.isFrozen = false;
      this.setState({ newGamePrompt: false });
    } else if (element === "InfoToast") {
      this.setState({ infoToast: false });
    } else {
      throw new Error("Invalid element");
    }
  }
  
  render() {
    return (
      <div id="components">
        <CommandLine render={this.state.commandLine} game={game} onShowElement={this.showElement} onClose={this.hideElement}/>
        <NewGamePrompt render={this.state.newGamePrompt} game={game} onClose={this.hideElement}/>
        <InfoToast render={this.state.infoToast} type={this.infoToastType} message={this.infoToastMessage} onClose={this.hideElement}/>
      </div>
    );
  }
}
