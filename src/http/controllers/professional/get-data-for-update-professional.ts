import { PersonNotFoundError } from '@/errors/person-not-found'
import { makeGetDataForUpdateProfessionalUseCase } from '@/factories/professional/make-get-data-for-update-professional-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const getDataForUpdateProfessional: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/professionals/profile/:professionalId',
      {
        schema: {
          tags: ['Professionals'],
          summary: 'Obter dados para atualizar profissional',
          description:
            'Fornece os dados necessários para preencher o formulário de edição do profissional (dados pessoais, endereço e informações profissionais).',
          params: z.object({
            professionalId: z.uuid(),
          }),
          response: {
            200: z.object({
              professional: z.object({
                name: z.string(),
                birthDate: z.date(),
                phone: z.string(),
                email: z.email(),
                cpf: z.string(),
                crp: z.string(),
                voluntary: z.boolean(),
                address: z.object({
                  street: z.string(),
                  neighborhood: z.string(),
                  number: z.number(),
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
          },
        },
      },
      async (request, reply) => {
        const { professionalId } = request.params

        try {
          const getDataForUpdateProfessionalUseCase =
            makeGetDataForUpdateProfessionalUseCase()

          const { professional } =
            await getDataForUpdateProfessionalUseCase.execute({
              professionalId,
            })

          return reply.status(200).send({ professional })
        } catch (error) {
          if (error instanceof PersonNotFoundError) {
            return reply.status(404).send({ message: error.message })
          }

          throw error
        }
      }
    )
  }
