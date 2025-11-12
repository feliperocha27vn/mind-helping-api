import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeCreateNewHourlyUseCase } from '@/factories/schedule/make-create-new-hourly-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const createNewHourly: FastifyPluginAsyncZod = async app => {
  app.post(
    '/hourlies',
    {
      schema: {
        body: z.object({
          scheduleId: z.string(),
          date: z.coerce.date(),
          hour: z.string(),
        }),
        response: {
          201: z.void(),
          404: z
            .object({ message: z.string() })
            .describe('Resource not found error'),
        },
      },
    },
    async (request, reply) => {
      const { scheduleId, date, hour } = request.body

      try {
        const createNewHourlyUseCase = makeCreateNewHourlyUseCase()

        await createNewHourlyUseCase.execute({
          scheduleId,
          date,
          hour,
        })

        return reply.status(201).send()
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        throw error
      }
    }
  )
}
