import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeGetByIdProfessionalUseCase } from '@/factories/professional/make-get-by-id-professional-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

export const getById: FastifyPluginAsyncZod = async app => {
  app.get(
    '/professional/:professionalId',
    {
      schema: {
        tags: ['Professionals'],
        description:
          'Recupera os detalhes de um profissional por `professionalId`, incluindo contato, endereço e outros metadados. Retorna 200 com o objeto `professional` ou 400/404 em caso de erro.',
        params: z.object({
          professionalId: z.string(),
        }),
        response: {
          200: z.object({
            professional: z.object({
              id: z.uuid(),
              name: z.string(),
              email: z.string(),
              phone: z.string(),
              address: z.string(),
              neighborhood: z.string(),
              city: z.string(),
              uf: z.string(),
            }),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { professionalId } = request.params

      const getByIdProfessionalUseCase = makeGetByIdProfessionalUseCase()

      try {
        const { professional } = await getByIdProfessionalUseCase.execute({
          professionalId,
        })

        return reply.status(200).send({ professional })
      } catch (err) {
        if (err instanceof ResourceNotFoundError) {
          return reply.status(400).send({
            message: err.message,
          })
        }
      }
    }
  )
}
