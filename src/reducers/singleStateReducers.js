export const isPencilEnabled = (state = true, action) => {
  switch (action.type) {
    case "TOGGLE_PEN":
      return !state;
    default:
      return state;
  }
}