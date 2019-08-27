import React from "react";
import styles from "./styles.module.css";
import Commands from "../commands";
import { useSelector } from "react-redux";

const Suggestions = () => {
  const inputValue = useSelector(state => state.inputValue);
  let show = [];

  let inputedArgs = inputValue
    .toLowerCase()
    .trimRight()
    .split(" ")
    .filter(arg => arg !== "");
  let inputedCommand = inputedArgs.shift();
  inputedCommand !== undefined &&
    Commands.forEach(command => {
      command.aliases.forEach(alias => {
        if (inputedCommand === alias) {
          let checkResponse = command.checkArgs(inputedArgs);
          show.push({
            name: [{ status: "passed", content: inputedCommand }],
            args: checkResponse.argParts
          });
        } else if (inputedCommand === alias.slice(0, inputedCommand.length)) {
          let untypedInput = alias.slice(inputedCommand.length, alias.length);
          show.push({
            name: [
              { status: "passed", content: inputedCommand },
              { status: "unreached", content: untypedInput }
            ],
            args: []
          });
        }
      });
    });

  return (
    <div className={styles.Suggestions}>
      <ul>
        {show.map((command, i) => (
          <li key={i}>
            {command.name.map((component, i) => {
              let className;
              component.status == "passed"
                ? (className = styles.passed)
                : (className = styles.unreached);
              return (
                <p className={className} key={i}>
                  {component.content}
                </p>
              );
            })}
            {command.args.map((component, i) => {
              let className;
              if (component.status === "passed") className = styles.passed;
              else if (component.status === "failed") className = styles.failed;
              else className = styles.unreached;
              return (
                <p className={`${className} ${styles.space}`} key={i}>
                  {component.content}
                </p>
              );
            })}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Suggestions;
