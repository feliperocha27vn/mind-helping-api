import { PersonNotFoundError } from '@/errors/person-not-found'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeGetCvvCallsByPersonIdUseCase } from '@/factories/cvv-calls/make-get-cvv-calls-by-person-id-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const getCvvCallsByPersonId: FastifyPluginAsyncZod = async app => {
  app.get(
    '/cvv-calls/:userId',
    {
      schema: {
        tags: ['CvvCalls'],
        description: 'Obtém todos os CVV Calls para o usuário especificado.',
        params: z.object({
          userId: z.uuid(),
        }),
        response: {
          200: z.object({
            cvvCalls: z
              .object({
                dateCalled: z.date(),
                timeCalled: z.string(),
                id: z.string(),
                userPersonId: z.string(),
              })
              .array(),
          }),
          404: z.object({
            message: z.string().describe('Person Not Found'),
          }),
          500: z.object({
            message: z.string().describe('Internal Server Error'),
          }),
        },
      },
    },
    async (request, reply) => {
      const { userId } = request.params

      const getCvvCallsByPersonId = makeGetCvvCallsByPersonIdUseCase()

      try {
        const { cvvCalls } = await getCvvCallsByPersonId.execute({
          userPersonId: userId,
        })

        reply.status(200).send({ cvvCalls })
      } catch (error) {
        if (
          error instanceof PersonNotFoundError ||
          error instanceof ResourceNotFoundError
        ) {
          reply.status(404).send({ message: error.message })
        }

        throw error
      }
    }
  )
}
