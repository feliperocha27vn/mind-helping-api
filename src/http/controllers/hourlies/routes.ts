import type { FastifyInstance } from 'fastify'
import { createNewHourly } from './create-new-hourly'
import { fetchManyByScheduleId } from './fetch-many-by-schedule-id'
import { setCancelHourly } from './set-cancel-hourly'

export function hourliesRoutes(app: FastifyInstance) {
  app.register(fetchManyByScheduleId)
  app.register(setCancelHourly)
  app.register(createNewHourly)
}
