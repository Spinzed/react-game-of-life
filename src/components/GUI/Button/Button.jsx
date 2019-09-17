import React from "react";
import styles from "./styles.module.css";

const Button = props => {
  return (
    <>
      <button className={styles.Button} onClick={props.onClick}>
        {props.children}
      </button>
    </>
  );
};

export default Button;
