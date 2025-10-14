import type { FastifyInstance } from 'fastify'
import { fetchMany } from './fetch-many'
import { getById } from './get-by-id'
import { getNumberPatients } from './get-number-patients'
import { getSchedulingsCancelByProfessionalId } from './get-schedulings-cancel-by-professional-id'

export function routesProfessional(app: FastifyInstance) {
  app.register(fetchMany)
  app.register(getById)
  app.register(getNumberPatients)
  app.register(getSchedulingsCancelByProfessionalId)
}
