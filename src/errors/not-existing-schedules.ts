export class NotExistingSchedulesError extends Error {
  constructor() {
    super('No existing schedules found')
  }
}
