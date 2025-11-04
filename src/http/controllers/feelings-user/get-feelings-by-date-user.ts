import { DateNotValidError } from '@/errors/date-not-valid'
import { PersonNotFoundError } from '@/errors/person-not-found'
import { makeGetFeelingsByDateUseCase } from '@/factories/feelings-user/make-get-feelings-by-date-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const getFeelingsByDateUser: FastifyPluginAsyncZod = async app => {
  app.get(
    '/feelings/:userId',
    {
      schema: {
        tags: ['Feelings'],
        summary: 'Listar sentimentos por intervalo de datas',
        description:
          'Busca sentimentos registrados por data para um usuário. Forneça `userId` como parâmetro e `date` no query string (ex: ?date=2025-10-14). Retorna lista de sentimentos no dia ou 404 se usuário não encontrado.',
        params: z.object({
          userId: z.uuid(),
        }),
        querystring: z.object({
          startDay: z.coerce.date(),
          endDay: z.coerce.date(),
        }),
        response: {
          200: z.object({
            feelings: z
              .object({
                description: z.enum([
                  'TRISTE',
                  'ANSIOSO',
                  'TEDIO',
                  'RAIVA',
                  'NÃO_SEI_DIZER',
                  'FELIZ',
                ]),
                id: z.uuid(),
                motive: z.string().nullable(),
                userPersonId: z.string(),
                createdAt: z.date(),
                updatedAt: z.date(),
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

      const getFeelingsByDateUseCase = makeGetFeelingsByDateUseCase()

      try {
        const { feelings } = await getFeelingsByDateUseCase.execute({
          userId,
          startDay,
          endDay,
        })

        return reply.status(200).send({ feelings })
      } catch (error) {
        if (error instanceof PersonNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        if (error instanceof DateNotValidError) {
          return reply.status(422).send({ message: error.message })
        }

        return reply.status(500).send({ message: 'Internal server error.' })
      }
    }
  )
}
