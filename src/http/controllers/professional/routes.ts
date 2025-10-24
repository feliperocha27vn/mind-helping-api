import type { FastifyInstance } from 'fastify'
import { fetchMany } from './fetch-many'
import { getAttendanceRate } from './get-attendance-rate'
import { getById } from './get-by-id'
import { getDataForUpdateProfessional } from './get-data-for-update-professional'
import { getNumberPatients } from './get-number-patients'
import { getSchedulingsByDate } from './get-schedulings-by-date'
import { getSchedulingsCancelByProfessionalId } from './get-schedulings-cancel-by-professional-id'
import { updateProfessional } from './update-professional'

export function routesProfessional(app: FastifyInstance) {
  app.register(fetchMany)
  app.register(getById)
  app.register(getNumberPatients)
  app.register(getSchedulingsCancelByProfessionalId)
  app.register(getSchedulingsByDate)
  app.register(getAttendanceRate)
  app.register(getDataForUpdateProfessional)
  app.register(updateProfessional)
}
