import { InvalidCredentialsError } from '@/errors/invalid-credentials'
import { PersonNotFoundError } from '@/errors/person-not-found'
import { makeUpdatePasswordPersonUseCase } from '@/factories/person/make-update-password'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const updatePasswordPerson: FastifyPluginAsyncZod = async app => {
  app.patch(
    '/users/password',
    {
      schema: {
        tags: ['Persons'],
        description:
          'Atualiza a senha da pessoa especificada por `personId`. Permite atualização parcial dos campos pessoais e de contato; retorna 204 em sucesso e 404 quando a pessoa não existe.',
        params: z.object({
          personId: z.uuid(),
        }),
        body: z.object({
          email: z.email(),
          repeatPassword: z.string().min(6),
          newPassword: z.string().min(6),
        }),
        response: {
          204: z.void(),
          404: z.object({
            message: z.string(),
          }),
          422: z.object({
            message: z.string(),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, repeatPassword, newPassword } = request.body

      const updatePasswordPersonUseCase = makeUpdatePasswordPersonUseCase()

      try {
        await updatePasswordPersonUseCase.execute({
          email,
          newPassword,
          repeatPassword,
        })

        return reply.status(204).send()
      } catch (error) {
        if (error instanceof PersonNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        if (error instanceof InvalidCredentialsError) {
          return reply.status(422).send({ message: error.message })
        }

        return reply.status(500).send({ message: 'Internal server error.' })
      }
    }
  )
}
