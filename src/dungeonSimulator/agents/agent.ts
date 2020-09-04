import { Action } from '../simulation'

export interface Agent {
    type: string
    qTable: number[][] | undefined
    getNextAction(state: number): Action
    update(
        oldState: number,
        newState: number,
        action: Action,
        reward: number
    ): void
    learningRate?: number
    discount?: number
    explorationRate?: number
    iterations?: number
    explorationDelta?: number
}
