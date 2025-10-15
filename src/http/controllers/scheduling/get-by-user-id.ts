import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeGetSchedulingUseCase } from '@/factories/scheduling/make-get-scheduling-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const getSchedulingByUserId: FastifyPluginAsyncZod = async app => {
  app.get(
    '/schedulings/:userId',
    {
      schema: {
        tags: ['Schedulings'],
        description:
          'Retorna os agendamentos (schedulings) de um usuário especificado por `userId`. Entrega detalhes como profissional, data, hora e endereço. Retorna 200 com os dados ou 404 se não encontrados.',
        params: z.object({
          userId: z.uuid(),
        }),
        response: {
          200: z.object({
            schedulingDetails: z.object({
              id: z.string(),
              nameProfessional: z.string(),
              phoneProfessional: z.string(),
              emailProfessional: z.string(),
              date: z.date(),
              hour: z.string(),
              address: z.object({
                street: z.string(),
                neighborhood: z.string(),
                complement: z.string(),
                cep: z.string(),
                city: z.string(),
                uf: z.string(),
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

      const getSchedulingUseCase = makeGetSchedulingUseCase()

      try {
        const { schedulingDetails } = await getSchedulingUseCase.execute({
          userId,
        })

        return reply.status(200).send({ schedulingDetails })
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        return reply.status(500).send({ message: 'Internal Server Error' })
      }
    }
  )
}
