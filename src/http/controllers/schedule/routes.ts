import type { FastifyInstance } from 'fastify'
import { createSchedule } from './create-schedule'
import { deleteSchedule } from './delete-schedule'
import { fetchManySchedule } from './fetch-many-schedule'

export function scheduleRoutes(app: FastifyInstance) {
  app.register(createSchedule)
  app.register(fetchManySchedule)
  app.register(deleteSchedule)
}
