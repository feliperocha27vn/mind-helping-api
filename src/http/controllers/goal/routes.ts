import type { FastifyInstance } from 'fastify'
import { create } from './create'

export function routesGoal(app: FastifyInstance) {
  app.register(create)
}
