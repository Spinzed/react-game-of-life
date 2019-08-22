export const renderCommandLine = (state = false, action) => {
  // console.log("test")
  if (action.target !== "CommandLine") return state;
  switch (action.type) {
    case "RENDER":
      return true;
    case "UNRENDER":
      return false;
    case "TOGGLE":
      return !state;
    default:
      return state;
  }
}

export const decoy = (state = 0, action) => { // sued for testing
  switch (action.type) {
    case "RENDER":
      return state + 1;
    case "UNRENDER":
      return state - 1;
    default:
      return state;
  }
}
