import { PersonNotFoundError } from '@/errors/person-not-found'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeAddCounterGoalUseCase } from '@/factories/goal/make-add-counter-goal-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const addCounter: FastifyPluginAsyncZod = async app => {
  app.patch(
    '/goal/counter/:goalId/:personId',
    {
      schema: {
        tags: ['Goal'],
        params: z.object({
          goalId: z.string(),
          personId: z.string(),
        }),
        response: {
          200: z.void(),
          404: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { goalId, personId } = request.params

      const addCounterGoalUseCase = makeAddCounterGoalUseCase()

      try {
        await addCounterGoalUseCase.execute({ goalId, personId })

        return reply.status(200).send()
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        if (error instanceof PersonNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        return reply.status(500).send({ message: 'Internal server error' })
      }
    }
  )
}
