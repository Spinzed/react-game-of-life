import React from "react";
import styles from "./styles.module.css";
import Commands from "../commands";
import { useDispatch } from "react-redux";
import { setInputValue, appendLogs } from "actions";

const CommandInput = props => {
  const dispatch = useDispatch();
  const onValueChange = event => {
    dispatch(setInputValue(event.target.value));
  };
  React.useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Enter") {
        if (event.target.value === "") return;
        let inputedArgs = event.target.value
          .toLowerCase()
          .trimRight()
          .split(" ")
          .filter(arg => arg !== "");
        let inputedCommand = inputedArgs.shift();

        new Promise((resolve, reject) => {
          Commands.forEach(command => {
            command.aliases.forEach(alias => {
              if (alias !== inputedCommand) return;
              let checkResponse = command.checkArgs(inputedArgs);
              checkResponse.status == "passed"
                ? resolve({ alias: alias, command: command, args: inputedArgs })
                : reject(checkResponse.message);
            });
          });
          reject("Unknown command");
        }).then(
          response => {
            response.command.command(response.args);
            dispatch(
              appendLogs(
                "executed",
                "Command has been executed: " + response.alias
              )
            );
          },
          rejectedMessage => {
            dispatch(
              appendLogs(
                "rejected",
                "Command execution has failed: " + rejectedMessage
              )
            );
          }
        );

        event.target.value = "";
        dispatch(setInputValue(event.target.value));
      }
    }
    props.inputRef.current.focus();
    props.inputRef.current.addEventListener("keydown", onKeyDown);
    return () => {
      props.inputRef.current.removeEventListener("keydown", onKeyDown);
    };
  });

  return (
    <div>
      <input
        ref={props.inputRef}
        onChange={onValueChange}
        className={styles.CommandInput}
        maxLength="256"
        type="text"
        resizable="false"
        wrap="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        autoComplete="off"
      />
    </div>
  );
};

export default CommandInput;
