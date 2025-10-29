import type { FastifyInstance } from 'fastify'
import { verifyResetPasswordCode } from './verify-reset-password-code'

export async function resetPasswordCodesRoutes(app: FastifyInstance) {
  app.register(verifyResetPasswordCode)
}
