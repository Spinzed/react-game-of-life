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
    case "APPEND_LOGS":
      return state.concat({
        id: state.length, // react optimization
        outcome: action.outcome,
        message: action.payload.value
      });
    default:
      return state;
  }
}