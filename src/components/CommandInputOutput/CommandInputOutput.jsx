import React from "react";
import styles from "./styles.module.css";
import OutputLogs from "./OutputLogs/OutputLogs.jsx";
import CommandInput from "./CommandInput/CommandInput.jsx";

const CommandInputOutput = props => {
  return (
    <div className={styles.CommandInputOutput}>
      <OutputLogs />
      <CommandInput inputRef={props.inputRef} />
    </div>
  );
};

export default CommandInputOutput;
