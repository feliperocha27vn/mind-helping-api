import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeCreateFeelingUserUseCase } from '@/factories/feelings-user/make-create-feeling-user-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const createFeelingsUser: FastifyPluginAsyncZod = async app => {
  app.post(
    '/feelings/:userId',
    {
      schema: {
        tags: ['FeelingsUser'],
        params: z.object({
          userId: z.uuid(),
        }),
        body: z.object({
          description: z.enum([
            'TRISTE',
            'ANSIOSO',
            'TEDIO',
            'RAIVA',
            'NÃO_SEI_DIZER',
            'FELIZ',
          ]),
          motive: z.string().nullable().optional(),
        }),
        response: {
          201: z.void(),
          404: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { userId } = request.params
      const { description, motive } = request.body

      const createFeelingUserUseCase = makeCreateFeelingUserUseCase()

      try {
        await createFeelingUserUseCase.execute({
          userPersonId: userId,
          description,
          motive,
        })

        return reply.status(201).send()
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        return reply.status(500).send({ message: 'Internal server error.' })
      }
    }
  )
}
