import Game from "game";

const commands = [
  {
    aliases: ["new"],
    args: [],
    description: "Make a new game with specified seed",
    command: null
  },
  {
    aliases: ["reset", "restart"],
    args: [],
    description: "Restart current game",
    command: () => Game.restart()
  },
  {
    aliases: ["stop", "pause", "freeze"],
    args: [],
    description: "Freeze the current game state",
    command: () => Game.stop()
  },
  {
    aliases: ["start", "continue"],
    args: [],
    description: "Continue the game",
    command: () => Game.continue()
  },
  {
    aliases: ["seed"],
    args: [],
    description: "Get the seed of the current game",
    command: null
  },
  {
    aliases: ["speed"],
    args: [
      "<speed>"
    ],
    description: "Set the speed",
    command: args => Game.setSpeed(args[0])
  },
  {
    aliases: ["help"],
    args: [],
    description: "Show Help menu",
    command: null
  }
]

export default commands;