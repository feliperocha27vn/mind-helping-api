import type { FastifyInstance } from 'fastify'
import { createScheduling } from './create-scheduling'
import { fetchSchedulingsByProfessionalId } from './fetch-schedulings-by-professional-id'
import { getSchedulingByUserId } from './get-by-user-id'
import { onFinishedConsultation } from './on-finished-consultation'

export function schedulingRoutes(app: FastifyInstance) {
  app.register(createScheduling)
  app.register(getSchedulingByUserId)
  app.register(fetchSchedulingsByProfessionalId)
  app.register(onFinishedConsultation)
}
