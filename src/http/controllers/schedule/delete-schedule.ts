import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeDeleteScheduleUseCase } from '@/factories/schedule/make-delete-schedule-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const deleteSchedule: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/schedules/:scheduleId',
    {
      schema: {
        tags: ['Schedules'],
        summary: 'Deletar agenda',
        description:
          'Deleta uma agenda (schedule) pelo ID. Os horários (hourly) associados serão deletados automaticamente devido ao CASCADE. Retorna 204 em caso de sucesso.',
        params: z.object({
          scheduleId: z.string().uuid(),
        }),
        response: {
          204: z.void(),
          404: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { scheduleId } = request.params

      const deleteScheduleUseCase = makeDeleteScheduleUseCase()

      try {
        await deleteScheduleUseCase.execute({
          scheduleId,
        })

        return reply.status(204).send()
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        return reply.status(500).send({ message: 'Internal server error.' })
      }
    }
  )
}
