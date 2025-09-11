import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeExecuteGoalUseCase } from '@/factories/goal/make-execute-goal-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

export const executeGoal: FastifyPluginAsyncZod = async app => {
  app.patch(
    '/goal/execute/:goalId/:personId',
    {
      schema: {
        tags: ['Goal'],
        params: z.object({
          goalId: z.uuid(),
          personId: z.uuid(),
        }),
        response: {
          200: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { goalId, personId } = request.params

      const executeGoalUseCase = makeExecuteGoalUseCase()

      try {
        await executeGoalUseCase.execute({ goalId, personId })

        return reply.status(200).send()
      } catch (error) {
        console.log('Error executing goal:', error)

        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        return reply.status(500).send({ message: 'Internal server error' })
      }
    }
  )
}
