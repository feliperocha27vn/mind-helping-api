import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { PersonNotFoundError } from '@/errors/person-not-found'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeFetchPatientsUseCase } from '@/factories/professional/make-fetch-patients-use-case'

export const fetchPatients: FastifyPluginAsyncZod = async app => {
  app.get(
    '/professionals/patients/:professionalId',
    {
      schema: {
        tags: ['Professionals'],
        summary: 'Obter pacientes de um profissional',
        description:
          'Retorna uma lista de pacientes associados a um profissional específico.',
        params: z.object({
          professionalId: z.uuid(),
        }),
        querystring: z.object({
          page: z.coerce.number().min(1).default(1),
        }),
        response: {
          200: z.object({
            patients: z.array(
              z.object({
                patientId: z.string(),
                patientName: z.string(),
                patientAge: z.number(),
              })
            ),
          }),
          404: z.object({
            message: z
              .string()
              .describe(
                'Message indicating that the requested resource was not found.'
              ),
          }),
        },
      },
    },
    async (request, reply) => {
      const { professionalId } = request.params
      const { page } = request.query

      try {
        const fetchPatientsUseCase = makeFetchPatientsUseCase()

        const { patients } = await fetchPatientsUseCase.execute({
          professionalId,
          page,
        })

        return reply.status(200).send({ patients })
      } catch (error) {
        if (
          error instanceof ResourceNotFoundError ||
          error instanceof PersonNotFoundError
        ) {
          return reply.status(404).send({ message: error.message })
        }

        throw error
      }
    }
  )
}
