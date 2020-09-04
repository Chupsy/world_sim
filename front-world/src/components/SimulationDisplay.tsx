import React, { FC, useState } from 'react'
import { Manager } from './Manager'

type Props = {
    manager: Manager
    id: string
}
export const SimulationDisplay: FC<Props> = ({ manager, id }) => {
    const [data, setData] = useState(manager.data)
    manager.registerUpdates((serverData: any) => {
        setData(serverData)
    })
    function generateMap() {
        const rows = []
        for (var i = 0; i < data.config.simulationConfig.length; i++) {
            rows.push(
                <td key={i}>{data.agents[id]?.state === i ? 'X' : '0'}</td>
            )
        }
        return rows
    }

    return (
        <div className="column">
            {data.agents[id]?.id}
            <div className="row">
                <table>
                    <tbody>
                        <tr>{generateMap()}</tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
