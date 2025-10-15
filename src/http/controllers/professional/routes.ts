import type { FastifyInstance } from 'fastify'
import { fetchMany } from './fetch-many'
import { getById } from './get-by-id'
import { getNumberPatients } from './get-number-patients'
import { getSchedulingsCancelByProfessionalId } from './get-schedulings-cancel-by-professional-id'
import { getSchedulingsByDate } from './get-schedulings-by-date'
import { getAttendanceRate } from './get-attendance-rate'

export function routesProfessional(app: FastifyInstance) {
  app.register(fetchMany)
  app.register(getById)
  app.register(getNumberPatients)
  app.register(getSchedulingsCancelByProfessionalId)
  app.register(getSchedulingsByDate)
  app.register(getAttendanceRate)
}
