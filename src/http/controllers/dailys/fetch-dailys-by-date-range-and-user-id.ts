import { DateNotValidError } from '@/errors/date-not-valid'
import { PersonNotFoundError } from '@/errors/person-not-found'
import { makeFetchDailysByDateRangeAndUserIdUseCase } from '@/factories/dailys/make-fetch-dailys-by-date-range-and-user-id'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const fetchDailysByDateRangeAndUserId: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/dailys/:userId',
      {
        schema: {
          params: z.object({
            userId: z.uuid(),
          }),
          querystring: z.object({
            startDay: z.coerce.date(),
            endDay: z.coerce.date(),
          }),
          response: {
            200: z.object({
              dailys: z
                .object({
                  content: z.string(),
                  id: z.uuid(),
                  createdAt: z.date(),
                  updatedAt: z.date(),
                  userPersonId: z.uuid(),
                })
                .array(),
            }),
            404: z.object({ message: z.string() }),
            422: z.object({ message: z.string() }),
            500: z.object({ message: z.string() }),
          },
        },
      },
      async (request, reply) => {
        const { userId } = request.params
        const { startDay, endDay } = request.query

        const fetchDailysByDateRangeAndUserIdUseCase =
          makeFetchDailysByDateRangeAndUserIdUseCase()

        try {
          const { dailys } =
            await fetchDailysByDateRangeAndUserIdUseCase.execute({
              userId,
              startDay,
              endDay,
            })

          return reply.status(200).send({ dailys })
        } catch (error) {
          if (error instanceof PersonNotFoundError) {
            reply.status(404).send({ message: error.message })
          }

          if (error instanceof DateNotValidError) {
            reply.status(422).send({ message: error.message })
          }

          reply.status(500).send({ message: 'Internal Server Error' })
        }
      }
    )
  }
