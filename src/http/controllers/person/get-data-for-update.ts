import { PersonNotFoundError } from '@/errors/person-not-found'
import { makeGetDataForUpdateUseCase } from '@/factories/person/make-get-data-for-update'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const getDataForUpdateUser: FastifyPluginAsyncZod = async app => {
  app.get(
    '/users/data-for-update/:userId',
    {
      schema: {
        description:
          'Fornece os dados necessários para preencher o formulário de edição do usuário (dados pessoais e de endereço) para o `userId` especificado.',
        params: z.object({
          userId: z.uuid(),
        }),
        response: {
          200: z.object({
            user: z.object({
              name: z.string(),
              birthDate: z.coerce.date(),
              phone: z.string(),
              email: z.email(),
              cpf: z.string(),
              gender: z.string(),
              address: z.object({
                street: z.string(),
                neighborhood: z.string(),
                number: z.number(),
                complement: z.string().nullable().optional(),
                cep: z.string(),
                city: z.string(),
                uf: z.string(),
              }),
            }),
          }),
          404: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { userId } = request.params

      const getDataForUpdateUserUseCase = makeGetDataForUpdateUseCase()

      try {
        const { user } = await getDataForUpdateUserUseCase.execute({ userId })

        return reply.status(200).send({ user })
      } catch (error) {
        if (error instanceof PersonNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        return reply.status(500).send({ message: 'Internal server error.' })
      }
    }
  )
}
