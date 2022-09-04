const State = {
  limbo: -1,
  void: 0,
  alive: 1,
  dead: 2
}

const deepcopy = (source) => JSON.parse(JSON.stringify(source))

export { State, deepcopy }
