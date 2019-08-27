import React from "react";
import styles from "./styles.module.css";
import OutputLogs from "./OutputLogs/OutputLogs.jsx";
import Suggestions from "./Suggestions/Suggestions.jsx";
import CommandInput from "./CommandInput/CommandInput.jsx";

const CommandInputOutput = props => {
  return (
    <div className={styles.CommandInputOutput}>
      <div className={styles.outputs}>
        <OutputLogs />
        <Suggestions />    
      </div>
      <CommandInput inputRef={props.inputRef} />
    </div>
  );
};

export default CommandInputOutput;
