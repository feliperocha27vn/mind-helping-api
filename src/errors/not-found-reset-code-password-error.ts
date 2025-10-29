export class NotFoundResetCodePasswordError extends Error {
  constructor() {
    super('Reset password code not found.')
  }
}
