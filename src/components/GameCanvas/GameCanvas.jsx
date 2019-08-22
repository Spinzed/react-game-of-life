import React from "react";
import styles from "./styles.module.css";
import Game from "../../game";

const GameCanvas = () => {
  React.useEffect(() => {
    if (!Game.isStarted) {
      Game.start(); // I loooove hooks, we all LOOOOOVE hooks <3
    }
  });
  return (
    <div className={styles.GameCanvas}>
      <canvas id="gameCanvas" width="800" height="500" />
    </div>
  )
}

export default GameCanvas;