import { PersonNotFoundError } from '@/errors/person-not-found'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeGetDailyByIdUseCase } from '@/factories/dailys/make-get-daily-by-id'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const getDailyById: FastifyPluginAsyncZod = async app => {
  app.get(
    '/dailys/:userId/:dailyId',
    {
      schema: {
        tags: ['Dailys'],
        params: z.object({
          userId: z.uuid(),
          dailyId: z.uuid(),
        }),
        reponse: {
          200: z.object({
            daily: z.object({
              content: z.string(),
              id: z.uuid(),
              createdAt: z.date(),
              updatedAt: z.date(),
              userPersonId: z.uuid(),
            }),
          }),
          404: z.object({
            message: z.string(),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { dailyId, userId } = request.params

      const getDailyByIdUseCase = makeGetDailyByIdUseCase()

      try {
        const { daily } = await getDailyByIdUseCase.execute({
          dailyId,
          userId,
        })

        return reply.status(200).send({ daily })
      } catch (error) {
        if (
          error instanceof PersonNotFoundError ||
          error instanceof ResourceNotFoundError
        ) {
          return reply.status(404).send({ message: error.message })
        }

        return reply.status(500).send({ message: 'Internal server error' })
      }
    }
  )
}
