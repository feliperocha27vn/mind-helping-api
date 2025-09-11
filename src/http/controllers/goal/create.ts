import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeCreateGoalUseCase } from '@/factories/goal/make-create-goal-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

export const create: FastifyPluginAsyncZod = async app => {
  app.post(
    '/goal',
    {
      schema: {
        tags: ['Goal'],
        body: z.object({
          userPersonId: z.string().uuid(),
          description: z.string(),
          numberDays: z.number().min(1),
        }),
      },
    },
    async (request, reply) => {
      const { userPersonId, description, numberDays } = request.body

      const createGoalUseCase = makeCreateGoalUseCase()

      try {
        await createGoalUseCase.execute({
          userPersonId,
          description,
          numberDays,
        })

        return reply.status(201).send()
      } catch (error) {
        console.log('Error details:', error) // Debug log

        if (error instanceof ResourceNotFoundError) {
          return reply.status(400).send({
            message: error.message,
          })
        }

        // Tratar outros erros
        return reply.status(500).send({
          message: 'Internal server error',
        })
      }
    }
  )
}
