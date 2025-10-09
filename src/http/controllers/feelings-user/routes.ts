import type { FastifyInstance } from 'fastify'
import { createFeelingsUser } from './create'
import { getFeelingsByDateUser } from './get-feelings-by-date-user'

export function feelingsUserRoutes(app: FastifyInstance) {
  app.register(createFeelingsUser)
  app.register(getFeelingsByDateUser)
}
