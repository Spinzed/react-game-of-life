export const render = (target) => {
  return {
    type: "RENDER",
    target: target
  }
}

export const unrender = (target) => {
  return {
    type: "UNRENDER",
    target: target
  }
}

export const toggle = (target) => {
  return {
    type: "TOGGLE",
    target: target
  }
}

export const setInputValue = (value) => {
  return {
    type: "SET_INPUT_VALUE",
    payload: {
      value: value
    }
  }
}

export const handleInput = (outcome, input, response) => {
  return {
    type: "HANDLE_INPUT",
    outcome: outcome,
    payload: {
      input: input,
      response: response
    }
  }
}
