import type { FastifyInstance } from 'fastify'
import { create } from './create'
import { deleteGoal } from './delete'
import { executeGoal } from './execute-goal'
import { fechMany } from './fetch-many'
import { update } from './update'

export function routesGoal(app: FastifyInstance) {
  app.register(create)
  app.register(deleteGoal)
  app.register(executeGoal)
  app.register(fechMany)
  app.register(update)
}
