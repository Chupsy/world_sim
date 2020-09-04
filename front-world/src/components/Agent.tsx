import Collapsible from 'react-collapsible'
import React, { FC, useState } from 'react'
import { Manager } from './Manager'
import Modal from 'react-modal'

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
}
type Props = {
    manager: Manager
    id: string
}
export const Agent: FC<Props> = ({ manager, id }) => {
    const [data, setData] = useState(manager.data)
    const updateId = manager.registerUpdates((serverData: any) => {
        setData(serverData)
    })
    const [modalIsOpen, setIsOpen] = React.useState(false)
    function openModal() {
        setIsOpen(true)
    }
    function closeModal() {
        setIsOpen(false)
    }

    return (
        <div className="agent column">
            <Collapsible trigger={data.agents[id]?.id}>
                <div className="row">
                    <div className="col">
                        <div>Configuration: </div>
                        <div>type: {data.agents[id]?.type}</div>
                        {data.agents[id]?.type === 'Gambler' && (
                            <div>
                                learningRate: {data.agents[id]?.learningRate}
                            </div>
                        )}
                        {data.agents[id]?.type === 'Gambler' && (
                            <div>discount: {data.agents[id]?.discount}</div>
                        )}
                        {data.agents[id]?.type === 'Gambler' && (
                            <div>
                                explorationRate:{' '}
                                {data.agents[id]?.explorationRate}
                            </div>
                        )}
                        {data.agents[id]?.type === 'Gambler' && (
                            <div>
                                explorationDelta:{' '}
                                {data.agents[id]?.explorationDelta}
                            </div>
                        )}
                    </div>
                    <div className="col">
                        <div>Total reward: {data.agents[id]?.totalReward}</div>
                        {data.agents[id]?.qTable && (
                            <div>
                                <button onClick={openModal}>Q Table</button>
                            </div>
                        )}
                        {!data?.isRunning && (
                            <button
                                onClick={() => {
                                    manager.unsubscribe(updateId)
                                    manager.deleteAgent(id)
                                }}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </div>
            </Collapsible>

            {data.agents[id]?.qTable && (
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Q Table"
                >
                    <button onClick={closeModal}>close</button>
                    <div>Q Table</div>
                    <div className="column">
                        <table>
                            <tbody>
                                {data.agents[id].qTable.map(
                                    (row: any[], index: number) => {
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    {index === 0 && '<='}
                                                    {index === 1 && '=>'}
                                                </td>
                                                {row.map((col, indexCol) => {
                                                    return (
                                                        <td key={indexCol}>
                                                            {' '}
                                                            {col}
                                                        </td>
                                                    )
                                                })}
                                            </tr>
                                        )
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>
                </Modal>
            )}
        </div>
    )
}
