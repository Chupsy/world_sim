export class Simulation {
    protected _state: number

    constructor(public config: SimulationConfig) {
        this._state = 0
    }

    public get state() {
        return this._state
    }

    public takeAction(action: Action) {
        let reward = 0
        if (Math.random() < this.config.slip) {
            action = this.reverseAction(action)
        }
        if (action === Action.BACKWARD) {
            this._state = 0
            reward = this.config.smallReward
        } else {
            if (this.state < this.config.length - 1) {
                this._state += 1
            } else {
                reward = this.config.largeReward
            }
        }
        return { reward, state: this._state }
    }

    public reset() {
        this._state = 0
        return this.state
    }

    private reverseAction(action: Action) {
        if (action === Action.FORWARD) {
            return Action.BACKWARD
        }
        return Action.FORWARD
    }
}

export interface SimulationConfig {
    length: number
    slip: number
    smallReward: number
    largeReward: number
}

export enum Action {
    FORWARD = 1,
    BACKWARD = 0,
}
