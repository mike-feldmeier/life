import React, { useEffect, useState } from 'react'

import "./Grid.css"

const makeRow = (row, y) => {
  return row.map((cell, x) => {
    return <div key={x} className="cell show-grid" data-index={x} data-state={cell.state} title={`y: ${y}, x: ${x}`}></div>
  })
}

const makeGrid = (world) => {
  return world.map((row, y) => {
    return <div key={y} className="row" data-index={y}>{makeRow(row, y)}</div>
  })
}

const Grid = (props) => {
  const [grid, setGrid] = useState(makeGrid(props.data.world))

  useEffect(() => {
    setGrid(makeGrid(props.data.world))
  }, [props.data.world])

  return (
    <div className="grid">
      <div className="content">
        {grid}
      </div>
    </div>
  )
}

export default Grid
