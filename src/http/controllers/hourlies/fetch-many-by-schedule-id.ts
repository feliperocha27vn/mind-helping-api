import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeFetchManyByScheduleIdUseCase } from '@/factories/hourlies/make-fetch-many-by-schedule-id-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const fetchManyByScheduleId: FastifyPluginAsyncZod = async app => {
  app.get(
    '/hourlies/:scheduleId',
    {
      schema: {
        tags: ['Hourlies'],
        summary: 'Listar horários disponíveis',
        description:
          'Lista horários (hourlies) disponíveis para um dado `scheduleId`. Retorna um array de horários com status de ocupação e informações da data.',
        params: z.object({
          scheduleId: z.uuid(),
        }),
        response: {
          200: z.object({
            hourlies: z
              .object({
                scheduleId: z.string(),
                date: z.date(),
                id: z.string(),
                hour: z.string(),
                isOcuped: z.boolean(),
              })
              .array(),
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
      const { scheduleId } = request.params

      const fetchManyByScheduleIdUseCase = makeFetchManyByScheduleIdUseCase()

      try {
        const { hourlies } = await fetchManyByScheduleIdUseCase.execute({
          scheduleId,
        })

        return reply.status(200).send({ hourlies })
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        return reply.status(500).send({ message: 'Internal server error.' })
      }
    }
  )
}
