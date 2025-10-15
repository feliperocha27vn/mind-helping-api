import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeGetUserByIdUseCase } from '@/factories/person/make-get-user-by-id-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const getUserById: FastifyPluginAsyncZod = async app => {
  app.get(
    '/users/:userId',
    {
      schema: {
        tags: ['Users'],
        description:
          'Retorna os dados completos de um usuário identificado por `userId`, incluindo informações de contato e endereço. Útil para exibir perfil e preencher formulários no front-end.',
        params: z.object({
          userId: z.uuid(),
        }),
        response: {
          200: z.object({
            user: z.object({
              name: z.string(),
              birthDate: z.date(),
              phone: z.string(),
              email: z.email(),
              cpf: z.string(),
              gender: z.string(),
              address: z.object({
                street: z.string(),
                neighborhood: z.string(),
                number: z.number(),
                cep: z.string(),
                city: z.string(),
              }),
            }),
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
      const { userId } = request.params

      const getUserByIdUseCase = makeGetUserByIdUseCase()

      try {
        const { user } = await getUserByIdUseCase.execute({ userId })

        return reply.status(200).send({ user })
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        return reply.status(500).send({ message: 'Internal Server Error' })
      }
    }
  )
}
