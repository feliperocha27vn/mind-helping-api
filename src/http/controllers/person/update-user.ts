import { PersonNotFoundError } from '@/errors/person-not-found'
import { makeUpdateUserUseCase } from '@/factories/person/make-update-user'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const updateUser: FastifyPluginAsyncZod = async app => {
  app.patch(
    '/users/:userId',
    {
      schema: {
        tags: ['Users'],
        summary: 'Atualizar dados do usuário',
        description:
          'Atualiza os dados do usuário especificado por `userId`. Permite atualização parcial dos campos pessoais e de contato; retorna 204 em sucesso e 404 quando o usuário não existe.',
        params: z.object({
          userId: z.uuid(),
        }),
        body: z.object({
          name: z.string().optional(),
          cpf: z.string().optional(),
          address: z.string().optional(),
          neighborhood: z.string().optional(),
          number: z.number().int().optional(),
          complement: z.string().optional(),
          cep: z.string().optional(),
          city: z.string().optional(),
          uf: z.string().length(2).optional(),
          phone: z.string().optional(),
          email: z.email().optional(),
          gender: z.string().optional(),
        }),
        response: {
          204: z.void(),
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
      const {
        name,
        cpf,
        address,
        neighborhood,
        number,
        complement,
        cep,
        city,
        uf,
        phone,
        email,
        gender,
      } = request.body

      const updateUserUseCase = makeUpdateUserUseCase()

      try {
        await updateUserUseCase.execute({
          userId,
          name,
          cpf,
          address,
          neighborhood,
          number,
          complement,
          cep,
          city,
          uf,
          phone,
          email,
          gender,
        })

        return reply.status(204).send()
      } catch (error) {
        if (error instanceof PersonNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        return reply.status(500).send({ message: 'Internal server error.' })
      }
    }
  )
}
