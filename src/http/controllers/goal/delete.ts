import { PersonNotFoundError } from '@/errors/person-not-found'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeDeleteGoalUseCase } from '@/factories/goal/make-delete-goal-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

export const deleteGoal: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/goal/:goalId/:personId',
    {
      schema: {
        tags: ['Goal'],
        description:
          'Remove uma meta (goal) pertencente a um usuário. Forneça `goalId` e `personId` como parâmetros. Retorna 204 em sucesso, 404 se não encontrado.',
        params: z.object({
          goalId: z.uuid(),
          personId: z.uuid(),
        }),
        response: {
          204: z.void(),
          404: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { goalId, personId } = request.params

      const deleteGoalUseCase = makeDeleteGoalUseCase()

      try {
        await deleteGoalUseCase.execute({ goalId, personId })

        return reply.status(204).send()
      } catch (error) {
        if (
          error instanceof PersonNotFoundError ||
          error instanceof ResourceNotFoundError
        ) {
          return reply.status(404).send({ message: error.message })
        }
        return reply.status(500).send({ message: 'Internal Server Error' })
      }
    }
  )
}
