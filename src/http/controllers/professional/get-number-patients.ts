import { PersonNotFoundError } from '@/errors/person-not-found'
import { makeGetNumberPatientsUseCase } from '@/factories/professional/make-get-number-patients'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const getNumberPatients: FastifyPluginAsyncZod = async app => {
  app.get(
    '/professionals/number-patients/:professionalId',
    {
      schema: {
        tags: ['Professionals'],
        description:
          'Retorna o número de pacientes associados a um profissional (`professionalId`). Útil para métricas e relatórios. Retorna 200 com `numberPatients` ou 404 se o profissional não for encontrado.',
        params: z.object({
          professionalId: z.uuid(),
        }),
        response: {
          200: z.object({
            numberPatients: z.number(),
          }),
          404: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { professionalId } = request.params

      const getNumberPatientsUseCase = makeGetNumberPatientsUseCase()

      try {
        const { numberPatients } = await getNumberPatientsUseCase.execute({
          professionalId,
        })

        return reply.status(200).send({ numberPatients })
      } catch (error) {
        if (error instanceof PersonNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        return reply.status(500).send({ message: 'Internal server error' })
      }
    }
  )
}
