import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeFetchManySchedulingsByScheduleIdUseCase } from '@/factories/scheduling/make-fetch-many-schedulings-by-schedule-id-use-case'

export const fetchManySchedulingsByScheduleId: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/schedulings/schedule/:scheduleId',
      {
        schema: {
          tags: ['Schedulings'],
          summary: 'Listar agendamentos por ID de profissional',
          description:
            'Lista agendamentos disponíveis para um dado `scheduleId`. Retorna um array de agendamentos com status de ocupação e informações da data.',
          params: z.object({
            scheduleId: z.uuid(),
          }),
          querystring: z.object({
            startDate: z.coerce.date(),
            endDate: z.coerce.date(),
            page: z.coerce.number().min(1).default(1),
          }),
          response: {
            200: z.object({
              schedulings: z
                .object({
                  pacientId: z.string(),
                  schedulingId: z.string(),
                  namePacient: z.string(),
                  hour: z.string(),
                })
                .array(),
            }),
            404: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { scheduleId } = request.params
        const { startDate, endDate, page } = request.query

        const fetchManySchedulingsByScheduleIdUseCase =
          makeFetchManySchedulingsByScheduleIdUseCase()

        try {
          const { schedulings } =
            await fetchManySchedulingsByScheduleIdUseCase.execute({
              scheduleId,
              startDay: startDate,
              endDay: endDate,
              page,
            })

          return reply.status(200).send({ schedulings })
        } catch (error) {
          if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: error.message })
          }

          throw error
        }
      }
    )
  }
