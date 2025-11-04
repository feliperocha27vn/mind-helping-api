import { PersonNotFoundError } from '@/errors/person-not-found'
import { makeCreateNewDailyUseCase } from '@/factories/dailys/make-create-new-daily'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const createNewDaily: FastifyPluginAsyncZod = async app => {
  app.post(
    '/dailys/:userId',
    {
      schema: {
        tags: ['Dailys'],
        summary: 'Criar novo diário',
        description: 'Cria um novo diário para o usuário especificado.',
        params: z.object({
          userId: z.uuid(),
        }),
        body: z.object({
          content: z.string().min(1),
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
      const { content } = request.body

      const createNewDailyUseCase = makeCreateNewDailyUseCase()

      try {
        await createNewDailyUseCase.execute({
          userId,
          content,
        })

        reply.status(201).send()
      } catch (error) {
        if (error instanceof PersonNotFoundError) {
          reply.status(404).send({ message: error.message })
        }

        reply.status(500).send({ message: 'Internal Server Error' })
      }
    }
  )
}
