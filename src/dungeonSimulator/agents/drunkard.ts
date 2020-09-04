import { Agent } from './agent'
import { Action } from '../simulation'

export class Drunkard implements Agent {
    type = 'Drunkard'
    qTable: number[][] | undefined
    getNextAction(state: number): Action {
        return Math.random() > 0.5 ? Action.FORWARD : Action.BACKWARD
    }
    update(
        oldState: number,
        newState: number,
        action: Action,
        reward: number
    ): void {}
}
