export class GoalCanOnlyBeExecutedOnceError extends Error {
  constructor() {
    super('Goal can only be executed once')
  }
}
