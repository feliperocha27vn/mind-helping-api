import type { FastifyInstance } from 'fastify'
import { authenticate } from './authenticate'
import { getMeUser } from './get-me-user'
import { registerProfessional } from './register-professional'
import { registerUser } from './register-user'

export async function personRoutes(app: FastifyInstance) {
  app.register(registerProfessional)
  app.register(registerUser)
  app.register(authenticate)
  app.register(getMeUser)
}
