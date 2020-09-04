import { Agent } from './agent'
import { Action } from '../simulation'

export class Gambler implements Agent {
    type = 'Gambler'
    qTable: number[][]
    public explorationDelta: number
    constructor(
        public learningRate: number = 0.1,
        public discount: number = 0.95,
        public explorationRate: number = 1.0,
        public iterations: number
    ) {
        this.qTable = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
        ]
        this.explorationDelta = 1 / this.iterations
    }

    getNextAction(state: number): Action {
        return Math.random() > this.explorationRate
            ? this.greedyAction(state)
            : this.randomAction()
    }

    update(
        oldState: number,
        newState: number,
        action: Action,
        reward: number
    ): void {
        const oldValue = this.qTable[action][oldState]
        const futurAction = this.greedyAction(newState)
        const futurReward = this.qTable[futurAction][newState]
        const newValue =
            oldValue +
            this.learningRate *
                (reward + this.discount * futurReward - oldValue)
        this.qTable[action][oldState] = newValue
        if (this.explorationRate > 0) {
            this.explorationRate -= this.explorationDelta
        }
    }

    private greedyAction(state: number): Action {
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
        return this.randomAction()
    }

    private randomAction(): Action {
        return Math.random() > 0.5 ? Action.FORWARD : Action.BACKWARD
    }
}
