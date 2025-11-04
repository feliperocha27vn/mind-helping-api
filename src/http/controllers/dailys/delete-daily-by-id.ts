import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeDeleteDailyByIdUseCase } from '@/factories/dailys/make-delete-daily-by-id'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const deleteDailyByIdUseCase: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/dailys/:userId/:dailyId',
    {
      schema: {
        tags: ['Dailys'],
        summary: 'Deletar diário',
        description:
          'Remove um diário específico do usuário. Retorna 204 em sucesso.',
        params: z.object({
          userId: z.uuid(),
          dailyId: z.uuid(),
        }),
        response: {
          204: z.void(),
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

      const deleteDailyByIdUseCase = makeDeleteDailyByIdUseCase()

      try {
        await deleteDailyByIdUseCase.execute({ dailyId, userId })

        return reply.status(204).send()
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        return reply.status(500).send({ message: 'Internal server error' })
      }
    }
  )
}
