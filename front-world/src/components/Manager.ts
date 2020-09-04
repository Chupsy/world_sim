import io from 'socket.io-client'
import { v4 } from 'uuid'
export class Manager {
    public data: {
        config: { iterationCount: number; simulationConfig: any }
        agents: any
        currentIteration: number
        isRunning: boolean
    }

    private statesToUpdate: Map<string, any>
    private socket: SocketIOClient.Socket

    constructor() {
        this.statesToUpdate = new Map()
        this.data = {
            config: { iterationCount: 1000, simulationConfig: {} },
            agents: {},
            currentIteration: 0,
            isRunning: false,
        }
        this.socket = io('localhost:3000').connect()
        this.socket.addEventListener('reconnect', () => {
            this.updateData()
        })
        this.updateData()
        setInterval(() => {
            this.updateData()
        }, 200)
    }

    private updateData(): any {
        this.socket.emit('data', (serverData: any) => {
            this.data = serverData
            this.loopUpdate()
        })
    }

    public registerUpdates(callback: any): string {
        const id = v4()
        this.statesToUpdate.set(id, callback)
        return id
    }

    public loopUpdate() {
        this.statesToUpdate.forEach((update) => update(this.data))
    }

    public unsubscribe(id: string) {
        this.statesToUpdate.delete(id)
    }

    public deleteAgent(id: string) {
        this.socket.emit('removeAgent', { id }, () => {
            this.updateData()
        })
    }

    public addAgent(agentConfig: any) {
        this.socket.emit('addAgent', agentConfig, () => {
            this.updateData()
        })
    }

    public start() {
        this.socket.emit('start', () => {
            this.updateData()
        })
    }

    public stop() {
        this.socket.emit('stop', () => {
            this.updateData()
        })
    }

    public reset() {
        this.socket.emit('reset', () => {
            this.updateData()
        })
    }

    public updateConfig(config: any) {
        this.socket.emit('updateOrchestrator', config, () => {
            this.updateData()
        })
    }
}
