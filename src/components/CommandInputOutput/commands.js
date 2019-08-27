import Game from "game";

const commands = [
  {
    aliases: ["new"],
    args: [],
    description: "Make a new game with specified seed",
    command: null,
    checkArgs: function (args) {
      return standardCheck(this.args, args);
    }
  },
  {
    aliases: ["reset", "restart"],
    args: [],
    description: "Restart current game",
    command: () => Game.restart(),
    checkArgs: function (args) {
      return standardCheck(this.args, args);
    }
  },
  {
    aliases: ["stop", "pause", "freeze"],
    args: [],
    description: "Freeze the current game state",
    command: () => Game.stop(),
    checkArgs: function (args) {
      return standardCheck(this.args, args);
    }
  },
  {
    aliases: ["start", "continue"],
    args: [],
    description: "Continue the game",
    command: () => Game.continue(),
    checkArgs: function (args) {
      return standardCheck(this.args, args);
    }
  },
  {
    aliases: ["seed"],
    args: [],
    description: "Get the seed of the current game",
    command: null,
    checkArgs: function (args) {
      return standardCheck(this.args, args);
    }
  },
  {
    aliases: ["speed"],
    args: [
      "<speed>"
    ],
    description: "Set the speed",
    command: args => Game.setSpeed(args[0]),
    checkArgs: function (args) {
      let response = standardCheck(this.args, args);
      if (args[0] < 0 || args[0] > 50) {
        response.status = "failed";
        if (response.message === "") response.message = "<speed> must be a value between 0 and 50";
        response.argParts[0].status = "failed"
        // hardcoded yea yea ikr
      }
      return response;
    }
  },
  {
    aliases: ["help"],
    args: [],
    description: "Show Help menu",
    command: null,
    checkArgs: function (args) {
      return standardCheck(this.args, args);
    }
  }
]

function standardCheck(functionArgs, toBeCheckedArgs) {
  let response = { status: "passed", message: "", argParts: [] };
  functionArgs.forEach((arg, i) => {
    let parsed = tryParseToInt(toBeCheckedArgs[i]);
    if (toBeCheckedArgs[i] == undefined) {
      response.status = "failed";
      response.message = "Too few arguments";
      response.argParts.push({ status: "unreached", content: arg });
    } else if (typeof (parsed) === getArgType(arg)) {
      response.argParts.push({ status: "passed", content: arg });
    } else {
      response.status = "failed";
      response.message = `${parsed} should be of type ${getArgType(arg)}, not ${typeof (parsed)}`,
      response.argParts.push({
        status: "failed",
        content: arg
      });
    }
  });
  if (toBeCheckedArgs.length > functionArgs.length) {
    response.status = "failed";
    response.message = "Too many arguments";
  }
  return response;
}

function getArgType(arg) {
  let start = arg[0];
  let end = arg[arg.length - 1];
  if (start === "<" && end === ">") {
    return "number";
  } else if (start === "[" && end === "]") {
    return "string";
  } else {
    throw new Error("Error: unknown argument type");
  }
}

function tryParseToInt(arg) {
  let parsedArg = arg;
  if (!isNaN(parseInt(arg))) parsedArg = parseInt(arg);
  return parsedArg;
}

export default commands;