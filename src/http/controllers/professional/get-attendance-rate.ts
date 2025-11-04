import { DateNotValidError } from '@/errors/date-not-valid'
import { PersonNotFoundError } from '@/errors/person-not-found'
import { makeGetAttendanceRate } from '@/factories/professional/make-get-attendance-rate'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const getAttendanceRate: FastifyPluginAsyncZod = async app => {
  app.get(
    '/professionals/attendance-rate/:professionalId',
    {
      schema: {
        tags: ['Professionals'],
        summary: 'Obter taxa de presença',
        description:
          'Calcula a taxa de presença dos agendamentos de um profissional entre `startDay` e `endDay`. Use as queries `startDay` e `endDay` no formato ISO. Retorna 200 com `attendanceRate` ou 400/404/500 conforme erro.',
        params: z.object({
          professionalId: z.uuid(),
        }),
        querystring: z.object({
          startDay: z.coerce.date(),
          endDay: z.coerce.date(),
        }),
        response: {
          200: z.object({
            attendanceRate: z.number(),
          }),
          400: z.object({
            message: z.string(),
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
      const { professionalId } = request.params
      const { startDay, endDay } = request.query

      const getAttendanceRateUseCase = makeGetAttendanceRate()

      try {
        const { attendanceRate } = await getAttendanceRateUseCase.execute({
          professionalId,
          startDay,
          endDay,
        })

        reply.status(200).send({ attendanceRate })
      } catch (error) {
        if (error instanceof DateNotValidError) {
          reply.status(400).send({ message: error.message })
        }

        if (error instanceof PersonNotFoundError) {
          reply.status(404).send({ message: error.message })
        }

        reply.status(500).send({ message: 'Internal server error.' })
      }
    }
  )
}
