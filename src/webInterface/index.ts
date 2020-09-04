import { Orchestrator } from '../dungeonSimulator/orchestrator'
import { Drunkard } from '../dungeonSimulator/agents/drunkard'
import io from 'socket.io'
import { Accountant } from '../dungeonSimulator/agents/accountant'
import { Gambler } from '../dungeonSimulator/agents/gambler'
let orchestrator: Orchestrator = new Orchestrator(2000, {
    length: 5,
    slip: 0.1,
    smallReward: 2,
    largeReward: 10,
})
io(3000).on('connect', (socket) => {
    console.log('connect')
    socket.on('data', (ack) => {
        const agentsData: any = {}
        orchestrator.agents.forEach((agent, id) => {
            agentsData[id] = {
                id,
                type: agent.instance.type,
                totalReward: agent.totalReward,
                state: agent.simulation.state,
                qTable: agent.instance.qTable,
                rewardHistory: agent.rewardHistory,
                learningRate: agent.instance.learningRate,
                discount: agent.instance.discount,
                explorationRate: agent.instance.explorationRate,
                explorationDelta: agent.instance.explorationDelta,
            }
        })
        return ack({
            config: {
                iterationCount: orchestrator.iterationCount,
                simulationConfig: orchestrator.simulationConfig,
            },
            currentIteration: orchestrator.loopIndex,
            isRunning: orchestrator.running,
            agents: agentsData,
        })
    })

    socket.on('updateOrchestrator', (data, ack) => {
        if (orchestrator.running) {
            return ack({ error: 'orchestrator already running' })
        }
        orchestrator.reset()
        orchestrator.simulationConfig = data.simulationConfig
        orchestrator.iterationCount = Number(data.iterationCount)
        ack()
    })
    socket.on('addAgent', (data, ack) => {
        if (orchestrator.running) {
            return ack({ error: 'orchestrator_running' })
        }
        let id: string = ''
        switch (data.type) {
            case 'drunkard':
                id = `Drunkard${orchestrator.agents.size}`
                if (orchestrator.agents.has(id)) {
                    id += 1
                }
                orchestrator.addAgent(id, new Drunkard())
                break
            case 'accountant':
                id = `Accountant${orchestrator.agents.size}`
                if (orchestrator.agents.has(id)) {
                    id += 1
                }
                orchestrator.addAgent(id, new Accountant())
                break
            case 'gambler':
                id = `Gambler${orchestrator.agents.size}`
                if (orchestrator.agents.has(id)) {
                    id += 1
                }
                orchestrator.addAgent(
                    id,
                    new Gambler(
                        data.learningRate,
                        data.discount,
                        data.explorationRate,
                        orchestrator.iterationCount
                    )
                )
                break
        }

        ack()
    })
    socket.on('removeAgent', (data, ack) => {
        if (orchestrator.running) {
            return ack({ error: 'orchestrator_running' })
        }

        orchestrator.removeAgent(data.id)
        ack()
    })
    socket.on('start', (ack) => {
        if (orchestrator.running) {
            return ack({ error: 'orchestrator_running' })
        }
        orchestrator.start()
        ack()
    })

    socket.on('stop', (ack) => {
        if (!orchestrator.running) {
            return ack({ error: 'orchestrator_not_running' })
        }
        orchestrator.stop()
        ack()
    })

    socket.on('reset', (ack) => {
        if (orchestrator.running) {
            return ack({ error: 'orchestrator_running' })
        }
        orchestrator.reset()
        ack()
    })
})
