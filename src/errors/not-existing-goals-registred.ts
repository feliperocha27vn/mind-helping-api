export class NotExistingGoalsRegisteredError extends Error {
  constructor() {
    super('No goals found for the specified person.')
  }
}
