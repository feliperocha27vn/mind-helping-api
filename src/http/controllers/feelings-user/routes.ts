import type { FastifyInstance } from 'fastify'
import { createFeelingsUser } from './create'
import { getFeelingByDayUser } from './get-feeling-by-day-user'

export function feelingsUserRoutes(app: FastifyInstance) {
  app.register(createFeelingsUser)
  app.register(getFeelingByDayUser)
}
