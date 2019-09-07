export const inputValue = (state = "", action) => {
  switch (action.type) {
    case "SET_INPUT_VALUE":
      return action.payload.value;
    default:
      return state;
  }
}

export const outputLogHistory = (state = [], action) => {
  switch (action.type) {
    case "HANDLE_INPUT":
      return state.concat({
        id: state.length, // react optimization
        outcome: action.outcome,
        message: action.payload.response
      });
    default:
      return state;
  }
}

export const inputedCommandHistory = (state = [], action) => {
  switch (action.type) {
    case "HANDLE_INPUT":
      if (state[state.length - 1] !== action.payload.input) {
        return state.concat(action.payload.input);
      }
      return state;
    default:
      return state;
  }
}
