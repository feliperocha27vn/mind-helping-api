import type { FastifyInstance } from 'fastify'
import { createScheduling } from './create-scheduling'
import { getSchedulingByUserId } from './get-by-user-id'

export function schedulingRoutes(app: FastifyInstance) {
  app.register(createScheduling)
  app.register(getSchedulingByUserId)
}
