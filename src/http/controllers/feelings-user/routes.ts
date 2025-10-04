import type { FastifyInstance } from 'fastify'
import { createFeelingsUser } from './create'

export function feelingsUserRoutes(app: FastifyInstance) {
  app.register(createFeelingsUser)
}
