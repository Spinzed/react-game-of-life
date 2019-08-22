import React from "react";
import GameCanvas from "./components/GameCanvas/GameCanvas.jsx";
import CMDIO from "./components/CommandInputOutput/CommandInputOutput.jsx";
import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import { render, unrender } from "actions";

const App = () => {
  const renderCommandLine = useSelector(state => state.renderCommandLine);
  const dispatch = useDispatch();
  const inputRef = React.useRef();
  React.useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Enter") {
        dispatch(render("CommandLine"));
        inputRef.current.focus();
      } else if (event.key === "Escape") {
        dispatch(unrender("CommandLine"));
      }
    }
    document.addEventListener("keydown", onKeyDown);
  });
  return (
    <div className="App">
      <div className="AppMain">
        <div id="title" className="center_content">
          Conway's Game of Life
        </div>
        <GameCanvas />
      </div>
      {renderCommandLine && <CMDIO inputRef={inputRef} />}
    </div>
  );
};

export default App;
