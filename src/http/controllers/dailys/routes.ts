import type { FastifyInstance } from 'fastify'
import { createNewDaily } from './create-new-daily'
import { fetchDailysByDateRangeAndUserId } from './fetch-dailys-by-date-range-and-user-id'
import { getDailyById } from './get-daily-by-id'
import { deleteDailyByIdUseCase } from './delete-daily-by-id'

export function dailysRoutes(app: FastifyInstance) {
  app.register(createNewDaily)
  app.register(fetchDailysByDateRangeAndUserId)
  app.register(getDailyById)
  app.register(deleteDailyByIdUseCase)
}
