import type { FastifyInstance } from 'fastify'
import { createScheduling } from './create-scheduling'

export function schedulingRoutes(app: FastifyInstance) {
  app.register(createScheduling)
}
