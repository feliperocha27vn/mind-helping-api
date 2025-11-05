import { AccountDeletedError } from '@/errors/account-deleted'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeSetCancelHourlyUseCase } from '@/factories/hourlies/make-set-cancel-hourly-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const setCancelHourly: FastifyPluginAsyncZod = async app => {
  app.patch(
    '/hourlies/:hourlyId/:schedulingId',
    {
      schema: {
        summary: 'Cancelar horário (hourly)',
        tags: ['Hourlies'],
        description:
          'Cancela um horário (hourly) específico, tornando-o disponível para novos agendamentos.',
        params: z.object({
          hourlyId: z.uuid(),
          schedulingId: z.uuid(),
        }),
        response: {
          204: z.void(),
          404: z.object({
            message: z.string(),
          }),
          410: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { hourlyId, schedulingId } = request.params

      const setCancelHourlyUseCase = makeSetCancelHourlyUseCase()

      try {
        await setCancelHourlyUseCase.execute({
          hourlyId,
          schedulingId,
        })

        return reply.status(204).send()
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        if (error instanceof AccountDeletedError) {
          return reply.status(410).send({ message: error.message })
        }

        throw error
      }
    }
  )
}
