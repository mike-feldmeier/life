import React, { useState } from 'react'

import "./ControlPanel.css"
import { deepcopy } from './utilities.js'

const createMultiValueSelectors = (handler, ruleset) => {
  return new Array(8).fill(0).map((e, i) => <div key={i} className={`multi-value-selector ${ruleset.includes(i + 1) ? 'active' : ''}`} onClick={handler} data-value={i + 1}>{i + 1}</div>)
}

const createRulesLabel = (rules) => {
  return `B${rules.born.sort().join('')}/S${rules.survives.sort().join('')}`
}

const ControlPanel = (props) => {
  const [displayLoadMenu, setDisplayLoadMenu] = useState(false)

  const handleBornClick = (e) => {
    const value = +e.target.dataset.value
    const newrules = deepcopy(props.data.rules)

    if(props.data.rules.born.includes(value)) {
      newrules.born = newrules.born.filter(n => n !== value)
      props.commands.setRules(newrules)
    }
    else {
      newrules.born.push(value)
      props.commands.setRules(newrules)
    }
  }

  const handleSurvivesClick = (e) => {
    const value = +e.target.dataset.value
    const newrules = deepcopy(props.data.rules)

    if(props.data.rules.survives.includes(value)) {
      newrules.survives = newrules.survives.filter(n => n !== value)
      props.commands.setRules(newrules)
    }
    else {
      newrules.survives.push(value)
      props.commands.setRules(newrules)
    }
  }

  const proxy = (fn) => (e) => {
    if(!props.data.running) {
      fn(e) 
    }
  }

  const toggleLoadMenu = () => {
    setDisplayLoadMenu(!displayLoadMenu)
  }

  const loadPreset = (preset) => () => {
    props.commands.load(preset)
    setDisplayLoadMenu(false)
  }

  const presetMenu = () => {
    return props.data.presets.map((key, i) => <div key={i} className="popup-item" onClick={loadPreset(key)}>{key}</div>)
  }
  
  return (
    <div className="control-panel">

      <div className="body">
        <div className="rules">
          <div className="header">
            <div className="title">Rules</div>
            <div className="specification">
              {createRulesLabel(props.data.rules)}
            </div>
          </div>
          <div className="born multi-value">
            <label>Born</label>
            {createMultiValueSelectors(handleBornClick, props.data.rules.born)}
          </div>
          <div className="survives multi-value">
            <label>Survives</label>
            {createMultiValueSelectors(handleSurvivesClick, props.data.rules.survives)}
          </div>
        </div>

        <div className="statistics">
          <div className="header">
            <div className="title">Statistics</div>
          </div>
          <div className="line">
            <label>Grid Size</label>
            <div className="value">x: {props.data.worldDimensions.x}, y: {props.data.worldDimensions.y}</div>
          </div>
          <div className="line">
            <label>Population</label>
            <div className="value">{props.data.census.alive}</div>
          </div>
          <div className="line">
            <label>Generation</label>
            <div className="value">{props.data.generation}</div>
          </div>
        </div>
      </div>

      <div className="footer">
        <div className="actions">
          <div className="multiple-buttons">
            <div className="slideup-wrapper">
            <div className={`popup-content ${displayLoadMenu ? 'visible' : ''}`}>
              {presetMenu()}
            </div>
            <div className={`button ${props.data.running ? 'disabled' : ''}`} onClick={proxy(toggleLoadMenu)}>Load Preset</div>
          </div>
          </div>
          <div className="multiple-buttons">
            <div className={`button ${props.data.running ? 'disabled' : ''}`} onClick={proxy(props.commands.step)}>Step</div>
            <div className={`button ${props.data.running ? 'disabled' : ''}`} onClick={proxy(props.commands.clear)}>Clear</div>
          </div>
          <div className="button big" onClick={props.commands.startStop}>{props.data.running ? 'Stop' : 'Start'}</div>
        </div>
      </div>
    </div>
  )
}

export default ControlPanel
