import React, { useState } from 'react'
import { Simulation } from './components/Simulation'
import { Agent } from './components/Agent'
import { Manager } from './components/Manager'
import { SimulationDisplay } from './components/SimulationDisplay'
import { Chart } from './components/Chart'

function App(props: { manager: Manager }) {
    const [data, setData] = useState(props.manager.data)
    props.manager.registerUpdates((serverData: any) => {
        setData(serverData)
    })
    return (
        <div>
            <div style={{ textAlign: 'center' }}>
                <h1>World simulation</h1>
            </div>
            <div className="row">
                <div className="column col-4">
                    {Object.keys(data.agents).map((agent, index) => {
                        return (
                            <Agent
                                key={index}
                                manager={props.manager}
                                id={agent}
                            ></Agent>
                        )
                    })}
                </div>
                <div className="column col-8">
                    {Object.keys(data.agents).map((agent, index) => {
                        return (
                            <SimulationDisplay
                                key={index + 'simDisplay'}
                                manager={props.manager}
                                id={agent}
                            ></SimulationDisplay>
                        )
                    })}
                </div>
            </div>
            <Simulation manager={props.manager}></Simulation>
            <Chart manager={props.manager}></Chart>
        </div>
    )
}

export default App
