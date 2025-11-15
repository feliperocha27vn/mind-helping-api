import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { PersonNotFoundError } from '@/errors/person-not-found'
import { makeGetNumberPatientsServedByMonthUseCase } from '@/factories/scheduling/make-get-number-patients-served-by-month-use-case'

export const getNumberPatientsServedByMonth: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/professionals/number-of-patients-served/:professionalId',
      {
        schema: {
          tags: ['Professionals'],
          summary: 'Obter número de pacientes atendidos',
          description:
            'Retorna o número de pacientes atendidos por um profissional no mês especificado. Útil para métricas e relatórios.',
          params: z.object({
            professionalId: z.string(),
          }),
          querystring: z.object({
            month: z.coerce.number(),
          }),
          response: {
            200: z.object({
              numberPatientsServedByMonth: z.number(),
            }),
            404: z.object({ message: z.string() }),
          },
        },
      },
      async (request, reply) => {
        const { professionalId } = request.params
        const { month } = request.query

        const getNumberPatientsServedByMonthUseCase =
          makeGetNumberPatientsServedByMonthUseCase()

        try {
          const { numberPatientsServedByMonth } =
            await getNumberPatientsServedByMonthUseCase.execute({
              professionalId,
              month,
            })

          return reply.status(200).send({ numberPatientsServedByMonth })
        } catch (error) {
          if (error instanceof PersonNotFoundError) {
            return reply.status(404).send({ message: error.message })
          }

          throw error
        }
      }
    )
  }
