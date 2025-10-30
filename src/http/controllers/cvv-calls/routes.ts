import type { FastifyInstance } from 'fastify'
import { createNewCvvCall } from './create-new-cvv-call'
import { getCvvCallsByPersonId } from './get-cvv-calls-by-person-id'

export function cvvCallsRoutes(app: FastifyInstance) {
  app.register(createNewCvvCall)
  app.register(getCvvCallsByPersonId)
}
