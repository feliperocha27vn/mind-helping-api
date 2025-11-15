import type { FastifyInstance } from 'fastify'
import { createScheduling } from './create-scheduling'
import { fetchManySchedulingsByScheduleId } from './fetch-many-schedulings-by-schedule-id'
import { getSchedulingByUserId } from './get-by-user-id'
import { getNumberPatientsServedByMonth } from './get-number-patients-served-by-month'
import { onFinishedConsultation } from './on-finished-consultation'

export function schedulingRoutes(app: FastifyInstance) {
  app.register(createScheduling)
  app.register(getSchedulingByUserId)
  app.register(fetchManySchedulingsByScheduleId)
  app.register(onFinishedConsultation)
  app.register(getNumberPatientsServedByMonth)
}
