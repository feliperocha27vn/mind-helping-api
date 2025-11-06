import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeFetchSchedulingsByProfessionalIdUseCase } from '@/factories/scheduling/make-fetch-schedulings-by-professional-id-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const fetchSchedulingsByProfessionalId: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/schedulings/professional/:professionalId',
      {
        schema: {
          tags: ['Schedulings'],
          summary: 'Listar agendamentos por ID de profissional',
          description:
            'Lista agendamentos disponíveis para um dado `professionalId`. Retorna um array de agendamentos com status de ocupação e informações da data.',
          params: z.object({
            professionalId: z.uuid(),
          }),
          querystring: z.object({
            startDate: z.coerce.date(),
            endDate: z.coerce.date(),
          }),
          response: {
            200: z.object({
              schedulings: z
                .object({
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
        const { professionalId } = request.params
        const { startDate, endDate } = request.query

        const fetchSchedulingsByProfessionalIdUseCase =
          makeFetchSchedulingsByProfessionalIdUseCase()

        try {
          const { schedulings } =
            await fetchSchedulingsByProfessionalIdUseCase.execute({
              professionalId,
              startDay: startDate,
              endDay: endDate,
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
