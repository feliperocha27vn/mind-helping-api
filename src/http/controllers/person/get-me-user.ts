import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeGetMeUserUseCase } from '@/factories/person/make-get-me-user-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const getMeUser: FastifyPluginAsyncZod = async app => {
  app.get(
    '/me/:userId',
    {
      schema: {
        tags: ['User'],
        params: z.object({
          userId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            profile: z.object({
              nameUser: z.string(),
              cityAndUf: z.object({
                city: z.string(),
                uf: z.string(),
              }),
              lastFeeling: z.string(),
              countExecutedGoals: z.number(),
            }),
          }),
          404: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { userId } = request.params

      const getMeUserUseCase = makeGetMeUserUseCase()

      try {
        const { profile } = await getMeUserUseCase.execute({ userId })

        return reply.status(200).send({ profile })
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        return reply.status(500).send({ message: 'Internal server error.' })
      }
    }
  )
}
