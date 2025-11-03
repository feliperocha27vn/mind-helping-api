import { PersonNotFoundError } from '@/errors/person-not-found'
import { makeDeletePersonByIdUseCase } from '@/factories/person/make-delete-person-by-id'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const deletePersonById: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/persons/:personId',
    {
      schema: {
        tags: ['Persons'],
        description:
          'Deleta uma pessoa de acordo com `personId`. Retorna 204 em sucesso e 404 quando a pessoa não existe.',
        params: z.object({
          personId: z.string().uuid(),
        }),
        response: {
          204: z.void(),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { personId } = request.params

      const deletePersonByIdUseCase = makeDeletePersonByIdUseCase()

      try {
        await deletePersonByIdUseCase.execute({
          personId,
        })

        return reply.status(204).send()
      } catch (error) {
        if (error instanceof PersonNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        throw error
      }
    }
  )
}
