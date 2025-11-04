import { DateNotValidError } from '@/errors/date-not-valid'
import { PersonNotFoundError } from '@/errors/person-not-found'
import { makeGetSchedulingsCancelByProfessionalId } from '@/factories/professional/make-get-schedulings-cancel-by-professional-id'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const getSchedulingsCancelByProfessionalId: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/professionals/number-of-cancelations/:professionalId',
      {
        schema: {
          tags: ['Professionals'],
          summary: 'Obter número de cancelamentos',
          description:
            'Retorna o número de cancelamentos de agendamentos para um profissional no intervalo especificado (startDay → endDay). Útil para métricas e relatórios.',
          params: z.object({
            professionalId: z.string().uuid(),
          }),
          querystring: z.object({
            startDay: z.coerce.date(),
            endDay: z.coerce.date(),
          }),
          response: {
            200: z.object({
              schedulingsCancel: z.number(),
            }),
            400: z.object({ message: z.string() }),
            404: z.object({ message: z.string() }),
            500: z.object({ message: z.string() }),
          },
        },
      },
      async (request, reply) => {
        const { professionalId } = request.params
        const { startDay, endDay } = request.query

        const getSchedulingsCancelByProfessionalId =
          makeGetSchedulingsCancelByProfessionalId()

        try {
          const { schedulingsCancel } =
            await getSchedulingsCancelByProfessionalId.execute({
              professionalId,
              startDay,
              endDay,
            })

          return reply.status(200).send({ schedulingsCancel })
        } catch (error) {
          if (error instanceof PersonNotFoundError) {
            return reply.status(404).send({ message: error.message })
          }

          if (error instanceof DateNotValidError) {
            return reply.status(400).send({ message: error.message })
          }

          return reply.status(500).send({ message: 'Internal server error.' })
        }
      }
    )
  }
