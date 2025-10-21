import { PersonNotFoundError } from '@/errors/person-not-found'
import { makeCreateNewCvvCallUseCase } from '@/factories/cvv-calls/make-create-new-cvv-call-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const createNewCvvCall: FastifyPluginAsyncZod = async app => {
  app.post(
    '/cvv-calls/:userId',
    {
      schema: {
        tags: ['CvvCalls'],
        description: 'Cria um novo CVV Call para o usuário especificado.',
        params: z.object({
          userId: z.uuid(),
        }),
        body: z.object({
          dateCalled: z.coerce.date(),
          timeCalled: z.string(),
        }),
        response: {
          201: z.void(),
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
      const { dateCalled, timeCalled } = request.body

      const createNewCvvCallUseCase = makeCreateNewCvvCallUseCase()

      try {
        await createNewCvvCallUseCase.execute({
          dateCalled,
          timeCalled,
          userPersonId: userId,
        })

        reply.status(201).send()
      } catch (error) {
        if (error instanceof PersonNotFoundError) {
          reply.status(404).send({ message: error.message })
        }

        throw error
      }
    }
  )
}
