import { PersonNotFoundError } from '@/errors/person-not-found'
import { makeUpdateProfessionalUseCase } from '@/factories/professional/make-update-professional-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const updateProfessional: FastifyPluginAsyncZod = async app => {
  app.patch(
    '/professionals/:professionalId',
    {
      schema: {
        tags: ['Professionals'],
        description:
          'Atualiza os dados do profissional especificado por `professionalId`. Permite atualização parcial dos campos pessoais e de contato; retorna 204 em sucesso e 404 quando o profissional não existe.',
        params: z.object({
          professionalId: z.string().uuid(),
        }),
        body: z.object({
          name: z.string().optional(),
          birthDate: z.date().optional(),
          phone: z.string().optional(),
          email: z.email().optional(),
          cpf: z.string().optional(),
          voluntary: z.boolean().optional(),
          address: z.string().optional(),
          neighborhood: z.string().optional(),
          number: z.number().optional(),
          complement: z.string().optional(),
          cep: z.string().optional(),
          city: z.string().optional(),
          uf: z.string().optional(),
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
      const { professionalId } = request.params
      const {
        address,
        neighborhood,
        number,
        complement,
        cep,
        city,
        uf,
        birthDate,
        cpf,
        email,
        name,
        phone,
        voluntary,
      } = request.body

      const updateProfessionalUseCase = makeUpdateProfessionalUseCase()

      try {
        await updateProfessionalUseCase.execute({
          professionalId: professionalId,
          name,
          cpf,
          street: address,
          neighborhood,
          number,
          complement,
          cep,
          city,
          uf,
          phone,
          email,
          birthDate,
          voluntary,
        })

        return reply.status(204).send()
      } catch (error) {
        if (error instanceof PersonNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        throw error
      }
    }
  )
}
