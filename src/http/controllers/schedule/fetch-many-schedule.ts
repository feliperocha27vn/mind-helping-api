import { NotExistingSchedulesError } from '@/errors/not-existing-schedules'
import { makeFetchManyScheduleUseCase } from '@/factories/schedule/make-fetch-many-schedule-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const fetchManySchedule: FastifyPluginAsyncZod = async app => {
  app.get(
    '/schedules/:professionalId',
    {
      schema: {
        tags: ['Schedules'],
        params: z.object({
          professionalId: z.uuid(),
        }),
        response: {
          200: z.object({
            schedules: z
              .object({
                id: z.uuid(),
                professionalPersonId: z.uuid(),
                initialTime: z.date().nullable(),
                endTime: z.date().nullable(),
                interval: z.number(),
                cancellationPolicy: z.number(),
                averageValue: z.coerce.string(),
                observation: z.string().nullable(),
                isControlled: z.boolean(),
                createdAt: z.date(),
              })
              .array(),
          }),
          404: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { professionalId } = request.params

      const fetchManySchedulesUseCase = makeFetchManyScheduleUseCase()

      try {
        const { schedules } = await fetchManySchedulesUseCase.execute({
          professionalId,
        })

        return reply.status(200).send({ schedules })
      } catch (error) {
        if (error instanceof NotExistingSchedulesError) {
          return reply.status(404).send({ message: error.message })
        }

        return reply.status(500).send({ message: 'Internal server error' })
      }
    }
  )
}
