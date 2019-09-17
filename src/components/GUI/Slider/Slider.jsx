import React from "react";
import styles from "./styles.module.css";

const Slider = props => {
  return (
    <div>
      <input
        type="range"
        className={styles.Slider}
        min={props.min}
        max={props.max}
        onChange={props.onChange}
      />
      <div>{props.children}</div>
    </div>
  );
};

export default Slider;
