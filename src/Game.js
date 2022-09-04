import React, { useEffect, useState } from 'react'

import './Game.css'
import ControlPanel from './ControlPanel.js'
import Grid from './Grid.js'
import { State, deepcopy } from './utilities.js'

const PRESET_PATTERNS = {
  'R-Pentomino': [ [State.void, State.alive, State.alive], [State.alive, State.alive, State.void], [State.void, State.alive, State.void] ],
  'Glider': [ [State.void, State.alive, State.void], [State.void, State.void, State.alive], [State.alive, State.alive, State.alive] ],
  'Diehard':  [ [State.void, State.void, State.void, State.void, State.void, State.void, State.alive, State.void], 
                [State.alive, State.alive, State.void, State.void, State.void, State.void, State.void, State.void], 
                [State.void, State.alive, State.void, State.void, State.void, State.alive, State.alive, State.alive]
              ]
}

const place = (data, world) => {
  const center = { x: Math.floor(world[0].length / 2), y: Math.floor(world.length / 2) }
  const origin = { x: center.x - Math.floor(data[0].length / 2), y: center.y - Math.floor(data.length / 2) }

  const newWorld = deepcopy(world)
  data.forEach((row, y) => {
    row.forEach((cell, x) => {
      const newCell = deepcopy(world[origin.y + y][origin.x + x])
      newCell.state = cell
      newWorld[origin.y + y][origin.x + x] = newCell
    })
  })
  return newWorld
}

const buildCell = (state) => {
  return { state: state || State.void }
}

const buildWorld = (width, height) => {
  return new Array(height).fill(null).map(_ => new Array(width).fill(null).map(_ => buildCell()))
}

const countState = (world, state) => {
  return world.reduce((ra, row) => {
    return ra + row.reduce((ca, cell) => {
      return ca + (cell.state === state ? 1 : 0)
    }, 0)
  }, 0)
}

const LIMBO = buildCell(State.limbo)

const getNeighborhood = (world, x, y) => {
  return new Array(3).fill(0).map((row, i) => 
    new Array(3).fill(0).map((cell, j) => {
      if((x > 0 && x < world[0].length - 1) && (y > 0 && y < world.length - 1)) {
        return world[y + (i - 1)][x + (j - 1)]
      }
      else {
        return LIMBO
      }
    }
  ))
}

const Game = () => {
  const [rules, setRules] = useState({ born: [3], survives: [2, 3] })
  const [worldDimensions] = useState({ x: 100, y: 100 })
  let [world, setWorld] = useState(buildWorld(worldDimensions.x, worldDimensions.y))
  const [census, setCensus] = useState({ alive: countState(world, State.alive) })
  let   [generation, setGeneration] = useState(0)
  const [timer, setTimer] = useState(null)

  const startStop = () => {
    if(!timer) {
      setTimer(setInterval(() => processWorld(), 100))
    }
    else {
      clearInterval(timer)
      setTimer(null)
    }
  }

  const step = () => {
    processWorld(world)
  }
  
  const clear = () => {
    setWorld(buildWorld(worldDimensions.x, worldDimensions.y))
    setGeneration(0)
  }

  const load = (preset) => {
    setWorld(place(PRESET_PATTERNS[preset], world))
  }

  const processWorld = () => {
    const newWorld = deepcopy(world)

    world.forEach((row, y) => {
      row.forEach((cell, x) => {
        const neighbors = countState(getNeighborhood(world, x, y), State.alive) - (cell.state === State.alive ? 1 : 0)

        switch(cell.state) {
          case State.alive:
            if(!rules.survives.includes(neighbors)) {
              newWorld[y][x].state = State.dead
            }
            break
          default:
            if(rules.born.includes(neighbors)) {
              newWorld[y][x].state = State.alive
            }
        }
      })
    })

    world = newWorld
    setWorld(world)
    setGeneration(++generation)
  }

  useEffect(() => {
    const count = countState(world, State.alive)
    setCensus({ alive: count })

    if(!!timer && count === 0) {
      startStop()
    }
  }, [world])

  const data = { rules, worldDimensions, running: !!timer, world, census, generation, presets: Object.keys(PRESET_PATTERNS) }
  const commands = { setRules, startStop, step, clear, load }

  return (
    <div className='game'>
      <ControlPanel commands={commands} data={data}/>
      <Grid data={data}/>
    </div>
  )
}

export default Game
