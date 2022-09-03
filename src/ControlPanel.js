import React, { useState } from 'react'

import "./ControlPanel.css"

const DEFAULT_RULES = { born: [2], survives: [3, 4] }

const createMultiValueSelectors = (handler, ruleset) => {
  return new Array(8).fill(0).map((e, i) => <div key={i} className={`multi-value-selector ${ruleset.includes(i + 1) ? 'active' : ''}`} onClick={handler} data-value={i + 1}>{i + 1}</div>)
}

const createRulesLabel = (rules) => {
  return `B${rules.born.sort().join('')}/S${rules.survives.sort().join('')}`
}

const deepcopy = (source) => JSON.parse(JSON.stringify(source))

const ControlPanel = () => {
  const [rules, setRules] = useState(DEFAULT_RULES)

  const handleBornClick = (e) => {
    const value = +e.target.dataset.value
    const newrules = deepcopy(rules)

    if(rules.born.includes(value)) {
      newrules.born = rules.born.filter(n => n !== value)
      setRules(newrules)
    }
    else {
      newrules.born.push(value)
      setRules(newrules)
    }
  }

  const handleSurvivesClick = (e) => {
    const value = +e.target.dataset.value
    const newrules = deepcopy(rules)

    if(rules.survives.includes(value)) {
      newrules.survives = rules.survives.filter(n => n !== value)
      setRules(newrules)
    }
    else {
      newrules.survives.push(value)
      setRules(newrules)
    }
  }

  return (
    <div className="control-panel">

      <div className="body">
        <div className="rules">
          <div className="header">
            <div className="title">Rules</div>
            <div className="specification">
              {createRulesLabel(rules)}
            </div>
          </div>
          <div className="born multi-value">
            <label>Born</label>
            {createMultiValueSelectors(handleBornClick, rules.born)}
          </div>
          <div className="survives multi-value">
            <label>Survives</label>
            {createMultiValueSelectors(handleSurvivesClick, rules.survives)}
          </div>
        </div>

        <div className="statistics">
          <div className="header">
            <div className="title">Statistics</div>
          </div>
          <div className="line">
            <label>Grid Size</label>
            <div className="value">x: 300, y: 150</div>
          </div>
          <div className="line">
            <label>Population</label>
            <div className="value">500</div>
          </div>
          <div className="line">
            <label>Generation</label>
            <div className="value">9 999 999</div>
          </div>
        </div>
      </div>

      <div className="actions">
        <div className="multiple-buttons">
          <div className="button">Save</div>
          <div className="button">Load</div>
        </div>
        <div className="multiple-buttons">
          <div className="button">Step</div>
          <div className="button">Clear</div>
        </div>
        <div className="button">Start/Stop</div>
      </div>
    </div>
  )
}

export default ControlPanel
