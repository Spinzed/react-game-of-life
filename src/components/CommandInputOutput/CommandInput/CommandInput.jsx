import React from "react";
import styles from "./styles.module.css";
import Commands from "../commands";
import { useDispatch, useSelector } from "react-redux";
import { setInputValue, handleInput } from "actions";

const CommandInput = props => {
  const dispatch = useDispatch();
  const commandHistory = useSelector(state => state.inputedCommandHistory);
  const [activeHistory, setActiveHistory] = React.useState(NaN); // index of active input in history
  // VV This is to cache input value when scrolling history
  const [cachedInputValue, setCachedInputValue] = React.useState("");

  const onValueChange = event => {
    setActiveHistory(NaN);
    dispatch(setInputValue(event.target.value));
    setCachedInputValue(event.target.value);
  };
  const onKeyDown = event => {
    if (event.key === "Enter") {
      let inputValue = event.target.value;
      if (inputValue === "") return;
      let inputedArgs = inputValue
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
          let commandResponse =
            response.command.command(response.args) ||
            "Command has been executed: " + response.alias;
          dispatch(handleInput("executed", inputValue, commandResponse));
        },
        rejectedMessage => {
          let commandResponse =
            "Command execution has failed: " + rejectedMessage;
          dispatch(handleInput("rejected", inputValue, commandResponse));
        }
      );
      event.target.value = "";
      dispatch(setInputValue(event.target.value));
      setCachedInputValue(event.target.value);
    } else if (event.key == "ArrowUp") {
      event.preventDefault(); // this makes that the carret doesnt end up at the start of the input field
      let copy = activeHistory;
      isNaN(copy) ? (copy = commandHistory.length - 1) : copy--;
      if (copy >= 0) {
        setActiveHistory(copy);
        event.target.value = commandHistory[copy];
        dispatch(setInputValue(event.target.value));
      }
    } else if (event.key == "ArrowDown") {
      if (activeHistory < commandHistory.length - 1) {
        setActiveHistory(activeHistory + 1); // it updates the state at the end of code execution
        event.target.value = commandHistory[activeHistory + 1];
      } else {
        setActiveHistory(NaN);
        event.target.value = cachedInputValue;
      }
      dispatch(setInputValue(event.target.value));
    }
  };
  React.useEffect(() => {
    props.inputRef.current.focus();
  });

  return (
    <div>
      <input
        ref={props.inputRef}
        className={styles.CommandInput}
        onChange={onValueChange}
        onKeyDown={onKeyDown}
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
