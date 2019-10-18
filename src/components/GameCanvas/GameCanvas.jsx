import React from "react";
import styles from "./styles.module.css";
import CanvasControls from "./CanvasControls/CanvasControls.jsx";
import CanvasNode from "./CanvasNode/CanvasNode.jsx";
import Game from "game";
import { useSelector, useDispatch } from "react-redux";

const GameCanvas = () => {
  const dispatch = useDispatch();
  const isPencilEnabled = useSelector(state => state.isPencilEnabled);
  const currentShape = useSelector(state => state.activeShape);
  // VV this is used to detect whether onMouseMove handler should activate.
  //   if mous eis pressed down, it will store the pressed key.
  const [mouseDownButton, setMouseDownButton] = React.useState(null);

  const reviveCell = e => {
    let x = Game.getX(e.pageX - e.target.offsetLeft);
    let y = Game.getY(e.pageY - e.target.offsetTop);
    let cell = { x: x, y: y };
    Game.reviveCell(cell);
  };
  const killCell = e => {
    let x = Game.getX(e.pageX - e.target.offsetLeft);
    let y = Game.getY(e.pageY - e.target.offsetTop);
    let cell = { x: x, y: y };
    Game.killCell(cell);
  };

  const preventDflt = e => {
    e.preventDefault();
  };

  const loadShape = e => {
    let x = Game.getX(e.pageX - e.target.offsetLeft);
    let y = Game.getY(e.pageY - e.target.offsetTop);
    Game.loadShape(currentShape, x, y);
  };

  const usePen = e => {
    if (!isPencilEnabled) return;
    let button = mouseDownButton || String(e.button);
    if (button === "0") {
      reviveCell(e);
    } else if (button === "2") {
      killCell(e);
      document.addEventListener("contextmenu", preventDflt);
    }
    mouseDownButton === null && setMouseDownButton(String(e.button));
  };

  const applyShape = e => {
    e.button === 0
      ? Game.applyShape()
      : e.button === 2
      ? dispatch({ type: "SET_SHAPE", newShape: null })
      : null;
  };

  React.useEffect(() => {
    if (!Game.isStarted) {
      Game.start(); // I loooove hooks, we all LOOOOOVE hooks <3
    }
  });

  return (
    <div className={styles.GameCanvas}>
      <div>
        <CanvasNode
          onMouseDown={currentShape === null ? usePen : applyShape}
          onMouseUp={() => {
            document.removeEventListener("contextmenu", preventDflt);
            setMouseDownButton(null);
          }}
          onMouseMove={
            currentShape !== null
              ? loadShape
              : mouseDownButton !== null
              ? usePen
              : null
          }
          onContextMenu={e => e.preventDefault()}
        />
        <CanvasControls />
      </div>
    </div>
  );
};

export default GameCanvas;
