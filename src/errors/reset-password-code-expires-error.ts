export class ResetPasswordCodeExpiresError extends Error {
  constructor() {
    super('The reset password code has expired.')
  }
}
