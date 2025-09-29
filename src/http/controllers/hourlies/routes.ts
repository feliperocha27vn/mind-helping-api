import type { FastifyInstance } from 'fastify'
import { fetchManyByScheduleId } from './fetch-many-by-schedule-id'

export function hourliesRoutes(app: FastifyInstance) {
  app.register(fetchManyByScheduleId)
}
