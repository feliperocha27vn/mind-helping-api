export class PersonNotFoundError extends Error {
  constructor() {
    super('Person not found')
  }
}
