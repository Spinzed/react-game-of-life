import Game from "game";

export const isPencilEnabled = (state = true, action) => {
  switch (action.type) {
    case "TOGGLE_PEN":
      return !state;
    default:
      return state;
  }
}

export const activeShape = (state = null, action) => {
  switch (action.type) {
    case "SET_SHAPE":
      if (action.newShape === null) {
        Game.eraseShape();
      }
      return action.newShape;
    default:
      return state;
  }
}
