import { combineReducers } from "redux";
import { renderCommandLine, decoy } from "./renderReducers";
import { inputValue, outputLogHistory } from "./dataHoldingReducers";

const rootReducer = combineReducers({
  renderCommandLine: renderCommandLine,
  decoy: decoy,
  inputValue: inputValue,
  outputLogHistory: outputLogHistory
});

export default rootReducer;
