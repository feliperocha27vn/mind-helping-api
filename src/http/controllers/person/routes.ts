import type { FastifyInstance } from 'fastify'
import { authenticate } from './authenticate'
import { forgotPassword } from './forgot-password'
import { getDataForUpdateUser } from './get-data-for-update'
import { getMeUser } from './get-me-user'
import { getUserById } from './get-user-by-id'
import { registerProfessional } from './register-professional'
import { registerUser } from './register-user'
import { updatePasswordPerson } from './update-password'
import { updateUser } from './update-user'

export async function personRoutes(app: FastifyInstance) {
  app.register(registerProfessional)
  app.register(registerUser)
  app.register(authenticate)
  app.register(getMeUser)
  app.register(getUserById)
  app.register(getDataForUpdateUser)
  app.register(updateUser)
  app.register(updatePasswordPerson)
  app.register(forgotPassword)
}
