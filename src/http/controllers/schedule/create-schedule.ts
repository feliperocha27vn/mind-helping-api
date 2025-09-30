import { DateNotValidError } from '@/errors/date-not-valid'
import { makeCreateScheduleUseCase } from '@/factories/schedule/make-create-schedule-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const createSchedule: FastifyPluginAsyncZod = async app => {
  app.post(
    '/schedules/:professionalPersonId',
    {
      schema: {
        params: z.object({
          professionalPersonId: z.uuid(),
        }),
        body: z.object({
          initialTime: z.coerce.date(),
          endTime: z.coerce.date(),
          interval: z.number(),
          cancellationPolicy: z.number(),
          averageValue: z.number(),
          observation: z.string().max(500),
          isControlled: z.boolean(),
        }),
        response: {
          201: z.void(),
          400: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { professionalPersonId } = request.params
      const {
        initialTime,
        endTime,
        interval,
        cancellationPolicy,
        averageValue,
        observation,
        isControlled,
      } = request.body

      const createScheduleUseCase = makeCreateScheduleUseCase()

      try {
        await createScheduleUseCase.execute({
          professionalPersonId,
          initialTime,
          endTime,
          interval,
          cancellationPolicy,
          averageValue,
          observation,
          isControlled,
        })

        return reply.status(201).send()
      } catch (error) {
        if (error instanceof DateNotValidError) {
          return reply.status(400).send({ message: error.message })
        }

        return reply.status(500).send({ message: 'Internal server error.' })
      }
    }
  )
}
