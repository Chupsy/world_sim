import React, { FC, useState } from 'react'
import { Manager } from './Manager'
import Modal from 'react-modal'

type Props = {
    manager: Manager
}

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
Modal.setAppElement('#root')

export const Simulation: FC<Props> = ({ manager }) => {
    const [data, setData] = useState(manager.data)
    const [configData, setConfigData] = useState({
        iterationCount: data.config.iterationCount,
        simulationConfig: data.config.simulationConfig,
    })
    const [agentConfig, setAgentConfig] = useState({
        type: 'gambler',
        learningRate: 0.1,
        discount: 0.95,
        explorationRate: 1,
    })
    manager.registerUpdates((serverData: any) => {
        setData(serverData)
    })
    const [modalIsOpen, setIsOpen] = React.useState(false)
    function openModal() {
        setConfigData({
            iterationCount: data.config.iterationCount,
            simulationConfig: data.config.simulationConfig,
        })
        setIsOpen(true)
    }
    function closeModal() {
        setIsOpen(false)
    }

    function validateModal() {
        manager.updateConfig(configData)
        closeModal()
    }

    const [modalAgentIsOpen, setModalAgentIsOpen] = React.useState(false)
    function openModalAgent() {
        setModalAgentIsOpen(true)
    }
    function closeModalAgent() {
        setModalAgentIsOpen(false)
    }

    function validateModalAgent() {
        manager.addAgent(agentConfig)
        closeModalAgent()
    }

    function handleChange(event: any) {
        console.log(event.target.type, event.target.value, event.target.name)
        if (event.target.name === 'iterationCount') {
            setConfigData({ ...configData, iterationCount: event.target.value })
        } else {
            const dataToChange: any = {
                iterationCount: configData.iterationCount,
                simulationConfig: configData.simulationConfig,
            }
            dataToChange.simulationConfig[event.target.name] =
                event.target.value

            setConfigData(dataToChange)
        }
    }

    function handleChangeAgent(event: any) {
        const dataToChange: any = {
            type: agentConfig.type,
            learningRate: agentConfig.learningRate,
            discount: agentConfig.discount,
            explorationRate: agentConfig.explorationRate,
        }
        dataToChange[event.target.name] = event.target.value
        setAgentConfig(dataToChange)
    }

    return (
        <div className="simulation">
            <h1>Simulation</h1>
            <div className="row">
                <div className="col">
                    <div>Configuration: </div>
                    <div>Iteration count: {data.config.iterationCount}</div>
                    <div>Length: {data.config.simulationConfig.length}</div>
                    <div>Slip: {data.config.simulationConfig.slip}</div>
                    <div>
                        Small reward: {data.config.simulationConfig.smallReward}
                    </div>
                    <div>
                        Large reward: {data.config.simulationConfig.largeReward}
                    </div>
                </div>
                <div className="col">
                    <div>Current iteration: {data.currentIteration}</div>
                    {/* <div>Simulation time: 02:35:48</div> */}
                    <div className="row">
                        {data.isRunning && (
                            <button onClick={() => manager.stop()}>Stop</button>
                        )}
                        {!data.isRunning && (
                            <button onClick={() => manager.start()}>
                                Start
                            </button>
                        )}
                        {!data.isRunning && (
                            <button onClick={() => manager.reset()}>
                                Reset
                            </button>
                        )}
                        {!data.isRunning && (
                            <button onClick={openModal}>Configure</button>
                        )}
                        {!data.isRunning && (
                            <button onClick={openModalAgent}>
                                {/* <button onClick={() => manager.addAgent()}> */}
                                Add agent
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Config simulation"
            >
                <button onClick={closeModal}>close</button>
                <button onClick={validateModal}>Validate</button>
                <div>Configure</div>
                <div className="column">
                    <form>
                        Iteration count:{' '}
                        <input
                            type="text"
                            name="iterationCount"
                            value={configData?.iterationCount}
                            onChange={handleChange}
                        />
                        <br />
                        Length:{' '}
                        <input
                            type="text"
                            name="length"
                            value={configData?.simulationConfig.length}
                            onChange={handleChange}
                        />
                        <br />
                        Slip:{' '}
                        <input
                            type="text"
                            name="slip"
                            value={configData?.simulationConfig.slip}
                            onChange={handleChange}
                        />
                        <br />
                        Small reward:{' '}
                        <input
                            type="text"
                            name="smallReward"
                            value={configData?.simulationConfig.smallReward}
                            onChange={handleChange}
                        />
                        <br />
                        Large reward:{' '}
                        <input
                            type="text"
                            name="largeReward"
                            value={configData?.simulationConfig.largeReward}
                            onChange={handleChange}
                        />
                    </form>
                </div>
            </Modal>
            <Modal
                isOpen={modalAgentIsOpen}
                onRequestClose={closeModalAgent}
                style={customStyles}
                contentLabel="Add agent"
            >
                <button onClick={closeModalAgent}>close</button>
                <button onClick={validateModalAgent}>Validate</button>
                <div>Configure</div>
                <div className="column">
                    <form>
                        Type:{' '}
                        <select
                            name="type"
                            id="type"
                            value={agentConfig.type}
                            onChange={handleChangeAgent}
                        >
                            <option value="gambler">Gambler</option>
                            <option value="drunkard">Drunkard</option>
                            <option value="accountant">Accountant</option>
                        </select>
                        {agentConfig.type === 'gambler' && (
                            <div>
                                <br />
                                Learning rate:{' '}
                                <input
                                    type="text"
                                    name="learningRate"
                                    value={agentConfig.learningRate}
                                    onChange={handleChangeAgent}
                                />
                                <br />
                                Exploration rate:{' '}
                                <input
                                    type="text"
                                    name="explorationRate"
                                    value={agentConfig.explorationRate}
                                    onChange={handleChangeAgent}
                                />
                                <br />
                                Discount:{' '}
                                <input
                                    type="text"
                                    name="discount"
                                    value={agentConfig.discount}
                                    onChange={handleChangeAgent}
                                />
                            </div>
                        )}
                    </form>
                </div>
            </Modal>
        </div>
    )
}
