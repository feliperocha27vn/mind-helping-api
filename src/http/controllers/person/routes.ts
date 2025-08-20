import type { FastifyInstance } from 'fastify'
import { registerProfessional } from './register-professional'
import { registerUser } from './register-user'

export async function personRoutes(app: FastifyInstance) {
  app.register(registerProfessional)
  app.register(registerUser)
}
