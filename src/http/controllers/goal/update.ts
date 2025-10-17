import { GoalCanOnlyBeExecutedOnceError } from '@/errors/goal-can-only-be-executed-once'
import { InvalidParametersError } from '@/errors/invalid-parameters'
import { makeUpdateGoalUseCase } from '@/factories/goal/make-update-goal-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const update: FastifyPluginAsyncZod = async app => {
  app.patch(
    '/goal/update/:goalId/:personId',
    {
      schema: {
        tags: ['Goal'],
        description:
          'Atualiza uma meta (goal) do usuário. Recebe `goalId` e `personId` nos parâmetros e campos opcionais no corpo (ex.: description, numberDays). Retorna 200 em sucesso.',
        params: z.object({
          goalId: z.uuid(),
          personId: z.uuid(),
        }),
        body: z.object({
          description: z.string().max(255).optional(),
          numberDays: z.number().min(1).optional(),
        }),
        response: {
          200: z.void(),
          400: z.object({ message: z.string() }),
          409: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { goalId, personId } = request.params
      const { description, numberDays } = request.body

      const updateGoalUseCase = makeUpdateGoalUseCase()

      try {
        await updateGoalUseCase.execute({
          goalId,
          userPersonId: personId,
          description,
          numberDays,
        })

        return reply.status(200).send()
      } catch (error) {
        if (error instanceof InvalidParametersError) {
          return reply.status(400).send({ message: error.message })
        }
        if (error instanceof GoalCanOnlyBeExecutedOnceError) {
          return reply.status(409).send({ message: error.message })
        }

        return reply.status(500).send({ message: 'Internal server error' })
      }
    }
  )
}
