import { DateNotValidError } from '@/errors/date-not-valid'
import { PersonNotFoundError } from '@/errors/person-not-found'
import { makeGetSchedulingsByDate } from '@/factories/professional/make-get-schedulings-by-date'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const getSchedulingsByDate: FastifyPluginAsyncZod = async app => {
  app.get(
    '/professionals/number-schedulings/:professionalId',
    {
      schema: {
        tags: ['Profissionals'],
        description:
          'Obter o número de agendamentos para um profissional dentro de um intervalo de datas especificado.',
        params: z.object({
          professionalId: z.uuid(),
        }),
        querystring: z.object({
          startDay: z.coerce.date(),
          endDay: z.coerce.date(),
        }),
        response: {
          200: z.object({
            schedulingsCount: z.number().nullable(),
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

      const getSchedulingsByDateUseCase = makeGetSchedulingsByDate()

      try {
        const { schedulingsCount } = await getSchedulingsByDateUseCase.execute({
          professionalId,
          startDay,
          endDay,
        })

        return reply.status(200).send({ schedulingsCount })
      } catch (error) {
        if (error instanceof DateNotValidError) {
          return reply.status(400).send({ message: error.message })
        }

        if (error instanceof PersonNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        return reply.status(500).send({ message: 'Erro interno do servidor' })
      }
    }
  )
}
