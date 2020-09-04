import { Simulation, SimulationConfig } from './simulation'
import { Agent } from './agents/agent'

export class Orchestrator {
    public loopIndex: number
    public running: boolean

    public agents: Map<
        string,
        {
            instance: Agent
            totalReward: number
            rewardHistory: number[]
            simulation: Simulation
        }
    >

    constructor(
        public iterationCount: number,
        public simulationConfig: SimulationConfig
    ) {
        this.loopIndex = 0
        this.agents = new Map()
        this.running = false
    }

    public reset() {
        this.loopIndex = 0
        this.agents = new Map()
        this.running = false
    }

    public addAgent(id: string, agent: Agent): void {
        this.agents.set(id, {
            instance: agent,
            totalReward: 0,
            simulation: new Simulation(this.simulationConfig),
            rewardHistory: [],
        })
    }
    public removeAgent(id: string): void {
        this.agents.delete(id)
    }

    public start() {
        this.running = true
        this.loop()
    }
    public stop() {
        this.running = false
    }

    private loop() {
        if (
            (this.loopIndex > this.iterationCount && this.running) ||
            !this.running
        ) {
            return
        }
        this.agents.forEach((agent) => {
            const oldState = agent.simulation.state
            const action = agent.instance.getNextAction(oldState)
            const { reward, state: newState } = agent.simulation.takeAction(
                action
            )
            agent.instance.update(oldState, newState, action, reward)
            agent.totalReward += reward
            if (this.loopIndex % (this.iterationCount / 200) === 0) {
                agent.rewardHistory.push(agent.totalReward)
            }
        })
        this.loopIndex++

        setTimeout(() => this.loop(), 100)
    }
}
