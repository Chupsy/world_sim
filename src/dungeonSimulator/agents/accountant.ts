import { Agent } from './agent'
import { Action } from '../simulation'

export class Accountant implements Agent {
    type = 'Accountant'
    qTable: number[][]
    constructor() {
        this.qTable = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
        ]
    }
    getNextAction(state: number): Action {
        if (
            this.qTable[Action.FORWARD][state] >
            this.qTable[Action.BACKWARD][state]
        ) {
            return Action.FORWARD
        }
        if (
            this.qTable[Action.FORWARD][state] <
            this.qTable[Action.BACKWARD][state]
        ) {
            return Action.BACKWARD
        }
        return Math.random() > 0.5 ? Action.FORWARD : Action.BACKWARD
    }
    update(
        oldState: number,
        newState: number,
        action: Action,
        reward: number
    ): void {
        this.qTable[action][oldState] += reward
    }
}
