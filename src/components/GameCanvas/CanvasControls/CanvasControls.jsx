import React from "react";
import styles from "./styles.module.css";
import Checkbox from "components/GUI/Checkbox/Checkbox.jsx";
import { useDispatch } from "react-redux";

const CanvasControls = () => {
  const dispatch = useDispatch();
  const togglePen = () => {
    dispatch({type: "TOGGLE_PEN"});
  }
  return (
    <div className={styles.CanvasControls}>
      <div className={styles.alignLeft}>
        <button>Toggle Theme</button>
      </div>
      <div className={styles.alignRight}>
        <Checkbox onChange={togglePen}>Enable Pen</Checkbox>
      </div>
    </div>
  );
};

export default CanvasControls;
