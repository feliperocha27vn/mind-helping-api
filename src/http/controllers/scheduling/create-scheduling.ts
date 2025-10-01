import { InvalidParametersError } from '@/errors/invalid-parameters'
import { PersonNotFoundError } from '@/errors/person-not-found'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeCreateSchedulingUseCase } from '@/factories/scheduling/create-scheduling-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const createScheduling: FastifyPluginAsyncZod = async app => {
  app.post(
    '/schedulings',
    {
      schema: {
        tags: ['Schedulings'],
        body: z.object({
          professionalPersonId: z.string(),
          userPersonId: z.string(),
          scheduleId: z.string(),
          hour: z.string(),
          date: z.string(),
        }),
        response: {
          201: z.void(),
          404: z.object({ message: z.string() }),
          406: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { professionalPersonId, userPersonId, scheduleId, hour, date } =
        request.body

      const createSchedulingUseCase = makeCreateSchedulingUseCase()

      try {
        await createSchedulingUseCase.execute({
          professionalPersonId,
          userPersonId,
          scheduleId,
          hour,
          date,
        })

        return reply.status(201).send()
      } catch (error) {
        if (
          error instanceof PersonNotFoundError ||
          error instanceof ResourceNotFoundError
        ) {
          return reply.status(404).send({ message: error.message })
        }

        if (error instanceof InvalidParametersError) {
          return reply.status(406).send({ message: error.message })
        }

        return reply.status(500).send({ message: 'Internal server error.' })
      }
    }
  )
}
