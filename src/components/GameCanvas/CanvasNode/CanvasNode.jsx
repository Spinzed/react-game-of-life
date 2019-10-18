import React from "react";
import styles from "./styles.module.css";

const CanvasNode = props => (
  <canvas
    className={styles.CanvasNode}
    id="gameCanvas"
    width="600"
    height="400"
    onMouseDown={props.onMouseDown}
    onMouseUp={props.onMouseUp}
    onMouseMove={props.onMouseMove}
    onContextMenu={props.onContextMenu}
  />
);

export default CanvasNode;
