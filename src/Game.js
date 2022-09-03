import React from 'react'

import './Game.css'
import ControlPanel from './ControlPanel.js'
import Grid from './Grid.js'

const Game = () => {
  return (
    <div className='game'>
      <ControlPanel />
      <Grid />
    </div>
  )
}

export default Game
