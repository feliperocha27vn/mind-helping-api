import type { FastifyInstance } from 'fastify'
import { fetchMany } from './fetch-many'
import { getById } from './get-by-id'

export function routesProfessional(app: FastifyInstance) {
  app.register(fetchMany)
  app.register(getById)
}
