import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeOnFinishedConsultationUseCase } from '@/factories/scheduling/make-on-finished-consultation-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const onFinishedConsultation: FastifyPluginAsyncZod = async app => {
  app.patch(
    '/schedulings/finished-consultation/:schedulingId',
    {
      schema: {
        tags: ['Schedulings'],
        summary: 'Marcar consulta como finalizada',
        description:
          'Marca uma consulta como finalizada com base no `schedulingId` fornecido. Retorna 204 se a operação for bem-sucedida ou 404 se o agendamento não for encontrado.',
        params: z.object({
          schedulingId: z.uuid(),
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
      const { schedulingId } = request.params

      const onFinishedConsultationUseCase = makeOnFinishedConsultationUseCase()

      try {
        await onFinishedConsultationUseCase.execute({
          schedulingId,
        })

        return reply.status(204).send()
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        throw error
      }
    }
  )
}
