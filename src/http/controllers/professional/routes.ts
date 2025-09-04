import type { FastifyInstance } from 'fastify'
import { fetchMany } from './fetch-many'

export function routesProfessional(app: FastifyInstance) {
  app.register(fetchMany)
}
