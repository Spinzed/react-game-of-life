import React from "react";
import styles from "./styles.module.css";
import CanvasControls from "./CanvasControls/CanvasControls.jsx";
import CanvasNode from "./CanvasNode/CanvasNode.jsx";
import Game from "game";
import { useSelector } from "react-redux";

const GameCanvas = () => {
  const isPencilEnabled = useSelector(state => state.isPencilEnabled);
  const reviveCell = e => {
    let x = e.pageX - e.target.offsetLeft;
    let y = e.pageY - e.target.offsetTop;
    Game.reviveCellAtPx(x, y);
  };
  const killCell = e => {
    let x = e.pageX - e.target.offsetLeft;
    let y = e.pageY - e.target.offsetTop;
    Game.killCellAtPx(x, y);
  };
  const preventDflt = e => {
    e.preventDefault();
    document.removeEventListener("contextmenu", preventDflt);
  };
  function removeListeners() {
    this.removeEventListener("mousemove", reviveCell);
    this.removeEventListener("mousemove", killCell);
    document.removeEventListener("mouseup", removeListeners);
  };
  const onCanvasClick = e => {
    if (!isPencilEnabled) return;
    removeListeners = removeListeners.bind(e.target);
    if (event.button === 0) {
      reviveCell(e);
      e.target.addEventListener("mousemove", reviveCell);
    } else if (event.button === 2) {
      killCell(e);
      e.target.addEventListener("mousemove", killCell);
    }
    document.addEventListener("mouseup", removeListeners);
    document.addEventListener("contextmenu", preventDflt);
  };
  React.useEffect(() => {
    if (!Game.isStarted) {
      Game.start(); // I loooove hooks, we all LOOOOOVE hooks <3
    }
  });
  return (
    <div className={styles.GameCanvas}>
      <div>
        <CanvasNode onMouseDown={onCanvasClick} />
        <CanvasControls />
      </div>
    </div>
  );
};

export default GameCanvas;
