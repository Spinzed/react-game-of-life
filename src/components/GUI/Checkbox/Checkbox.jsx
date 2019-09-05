import React from "react";
import styles from "./styles.module.css";

const Checkbox = props => {
  return (
    <div className={styles.Checkbox}>
      <input type="checkbox" onChange={props.onChange} defaultChecked/>
      <div>{props.children}</div>
    </div>
  );
};

export default Checkbox;
