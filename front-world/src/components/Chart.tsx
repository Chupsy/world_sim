import React, { FC, useState } from 'react'
import { Manager } from './Manager'
import { Line } from 'react-chartjs-2'

import * as colors from './Colors'

type Props = {
    manager: Manager
}

export const Chart: FC<Props> = ({ manager }) => {
    const [data, setData] = useState(manager.data)
    manager.registerUpdates((serverData: any) => {
        setData(serverData)
    })

    function getData() {
        const dataToReturn: any = {
            labels: [],
            datasets: [],
        }
        if (Object.keys(data.agents).length) {
            data.agents[Object.keys(data.agents)[0]].rewardHistory.map(
                (_: any, index: number) => {
                    dataToReturn.labels.push(
                        (index * data.config.iterationCount) / 200
                    )
                }
            )
        }
        if (data.agents) {
            Object.keys(data.agents).map((agentId: any, index) => {
                dataToReturn.datasets.push({
                    label: agentId,
                    data: data.agents[agentId].rewardHistory,
                    borderColor: colors.Classic20[index],
                    borderWidth: 1,
                })
            })
        }

        return dataToReturn
    }

    return (
        <div className="simulation">
            <h1>Chart</h1>
            <Line
                data={getData()}
                options={{ maintainAspectRatio: false }}
            ></Line>
        </div>
    )
}
