import { combineReducers } from "redux";
import { renderCommandLine, decoy } from "./renderReducers";
import { inputValue, outputLogHistory, inputedCommandHistory } from "./dataHoldingReducers";
import { isPencilEnabled, activeShape } from "./singleStateReducers";

const rootReducer = combineReducers({
  renderCommandLine: renderCommandLine,
  decoy: decoy,
  inputValue: inputValue,
  outputLogHistory: outputLogHistory,
  inputedCommandHistory: inputedCommandHistory,
  isPencilEnabled: isPencilEnabled,
  activeShape: activeShape
});

export default rootReducer;
