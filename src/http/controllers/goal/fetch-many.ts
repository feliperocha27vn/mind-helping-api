import { NotExistingGoalsRegisteredError } from '@/errors/not-existing-goals-registred'
import { PersonNotFoundError } from '@/errors/person-not-found'
import { makeFetchManyGoalsUseCase } from '@/factories/goal/make-fetch-many-goals-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const fechMany: FastifyPluginAsyncZod = async app => {
  app.get(
    '/goals/:personId',
    {
      schema: {
        tags: ['Goal'],
        summary: 'Listar metas do usuário',
        description:
          'Retorna todas as metas (goals) registradas para uma pessoa específica. Forneça o `personId` nos parâmetros de rota. Responde com um array de metas ou 404 se a pessoa ou metas não existirem.',
        params: z.object({
          personId: z.uuid(),
        }),
        response: {
          200: z.object({
            goals: z.array(
              z.object({
                id: z.string(),
                description: z.string(),
                userPersonId: z.string(),
                numberDays: z.number(),
                isExecuted: z.boolean(),
                isExpire: z.boolean(),
                counter: z.number(),
                createdAt: z.date(),
                updatedAt: z.date(),
              })
            ),
          }),
          404: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { personId } = request.params

      const fetchManyGoalsUseCase = makeFetchManyGoalsUseCase()

      try {
        const { goals } = await fetchManyGoalsUseCase.execute({ personId })

        return reply.status(200).send({ goals })
      } catch (error) {
        if (error instanceof PersonNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        if (error instanceof NotExistingGoalsRegisteredError) {
          return reply.status(404).send({ message: error.message })
        }

        return reply.status(500).send({ message: 'Internal server error' })
      }
    }
  )
}
