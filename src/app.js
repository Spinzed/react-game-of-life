import React from "react";
import ReactDOM from "react-dom";
import Interface from "./interface.jsx"
import Game from "./game.js";

const game = new Game("game-canvas", Math.round(Math.random() * 1000000));

ReactDOM.render(
    React.createElement(Interface),
    document.getElementById("interface")
)
export { game as Game }