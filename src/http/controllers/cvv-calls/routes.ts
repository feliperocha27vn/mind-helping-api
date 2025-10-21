import type { FastifyInstance } from 'fastify'
import { createNewCvvCall } from './create-new-cvv-call'

export function cvvCallsRoutes(app: FastifyInstance) {
  app.register(createNewCvvCall)
}
