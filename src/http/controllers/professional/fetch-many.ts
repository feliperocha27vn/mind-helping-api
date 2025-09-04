import { makeFetchManyProfessionalsUseCase } from '@/factories/professional/make-fetch-many-professionals-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

export const fetchMany: FastifyPluginAsyncZod = async app => {
  app.get(
    '/professionals',
    {
      schema: {
        tags: ['Professional'],
        querystring: z.object({
          search: z.string(),
        }),
        response: {
          200: z.object({
            professionals: z.array(
              z.object({
                id: z.uuid(),
                name: z.string(),
                email: z.string(),
                phone: z.string(),
                address: z.string(),
                neighborhood: z.string(),
                city: z.string(),
                uf: z.string(),
              })
            ),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { search } = request.query

      const fetchManyProfessionalsUseCase = makeFetchManyProfessionalsUseCase()

      try {
        const { professionals } = await fetchManyProfessionalsUseCase.execute({
          search,
        })
        return reply.status(200).send({ professionals })
      } catch (err) {
        if (err instanceof Error) {
          return reply.status(400).send({
            message: err.message,
          })
        }
      }
    }
  )
}
