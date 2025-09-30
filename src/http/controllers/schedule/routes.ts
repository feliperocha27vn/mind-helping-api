import type { FastifyInstance } from 'fastify'
import { createSchedule } from './create-schedule'

export function scheduleRoutes(app: FastifyInstance) {
  app.register(createSchedule)
}
