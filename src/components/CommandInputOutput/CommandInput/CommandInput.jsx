import React from "react";
import styles from "./styles.module.css";
import Commands from "./commands";
import { useDispatch } from "react-redux";
import { setInputValue, appendLogs } from "actions";

const CommandInput = props => {
  const dispatch = useDispatch();
  const onValueChange = event => {
    dispatch(setInputValue(event.target.value));
  };
  React.useEffect(() => {
    function getArgType(arg) {
      let start = arg[0];
      let end = arg[arg.length - 1]
      if (start === "<" && end === ">") {
        return "number";
      } else if (start === "[" && end === "]") {
        return "string";
      } else {
        throw new Error("Error: unknown argument type");
      }
    }

    function onKeyDown(event) {
      if (event.key === "Enter") {
        if (event.target.value === "") return;
        let input_args = event.target.value
          .toLowerCase()
          .trimRight()
          .split(" ")
          .filter(arg => arg !== "");
        let input_command = input_args.shift();

        new Promise((resolve, reject) => {
          Commands.forEach(command => {
            command.aliases.forEach(alias => {
              if (input_command === alias) {
                command.args.forEach((arg, i) => {
                  let shouldBe = getArgType(arg);
                  let isOf = typeof(input_args[i]);
                  if (shouldBe !== isOf) {
                    reject("\"" + arg + "\" should be of type " + shouldBe, ", not " + isOf);
                  };
                });
                resolve(input_command);
                command.command(input_args);
              }
            });
          });
          reject("Unknown command");
        })
        .then(resolvedMessage => {
          console.log("resolved")
          dispatch(appendLogs("executed","Command has been executed: " + resolvedMessage));
        }, rejectedMessage => {
          console.log("rejected")
          dispatch(appendLogs("rejected","Command execution has failed: " + rejectedMessage));
        });
        
        event.target.value = "";
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
