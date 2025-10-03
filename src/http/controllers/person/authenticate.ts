import { InvalidCredentialsError } from '@/errors/invalid-credentials'
import { makeAuthenticatePersonUseCase } from '@/factories/make-authenticate-person-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const authenticate: FastifyPluginAsyncZod = async app => {
  app.post(
    '/persons/authenticate',
    {
      schema: {
        tags: ['User', 'Professional'],
        body: z.object({
          email: z.email(),
          password: z.string().min(6),
        }),
        response: {
          200: z.object({
            isAuthenticated: z.boolean(),
          }),
          401: z.object({
            message: z.string(),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const authenticatePersonUseCase = makeAuthenticatePersonUseCase()

      try {
        const { isAuthenticated } = await authenticatePersonUseCase.execute({
          email,
          password,
        })

        return reply.status(200).send({ isAuthenticated })
      } catch (error) {
        if (error instanceof InvalidCredentialsError) {
          return reply.status(401).send({ message: error.message })
        }

        return reply.status(500).send({ message: 'Internal server error.' })
      }
    }
  )
}
