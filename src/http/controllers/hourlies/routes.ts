import type { FastifyInstance } from 'fastify'
import { fetchManyByScheduleId } from './fetch-many-by-schedule-id'
import { setCancelHourly } from './set-cancel-hourly'

export function hourliesRoutes(app: FastifyInstance) {
  app.register(fetchManyByScheduleId)
  app.register(setCancelHourly)
}
