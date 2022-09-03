import React from 'react'

import "./Grid.css"

const makeRow = (x) => new Array(x).fill(0).map((e, i) => <div key={i} className="cell show-grid" data-state="void"></div>)

const makeWorld = (x, y) => new Array(y).fill(0).map((e, i) => <div key={i} className="row">{makeRow(x)}</div>)

const Grid = (props) => {
  const world = makeWorld(200, 100)

  return (
    <div className="grid">
      <div className="content">
        {world}
      </div>
    </div>
  )
}

export default Grid
