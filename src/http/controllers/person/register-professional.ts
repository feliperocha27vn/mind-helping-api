import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { InvalidParametersError } from '../../../errors/invalid-parameters'
import { ResourceNotFoundError } from '../../../errors/resource-not-found-error'
import { makePersonUseCase } from '../../../factories/person/make-register-person-use-case'
import { makeRegisterProfessionalUseCase } from '../../../factories/person/make-register-professional-use-case'

export const registerProfessional: FastifyPluginAsyncZod = async app => {
  app.post(
    '/professional',
    {
      schema: {
        tags: ['Professionals'],
        summary: 'Registrar novo profissional',
        description:
          'Registra um novo profissional com dados pessoais e campos específicos (ex: CRP, voluntariado). Retorna o objeto `professional` com `person_id`, `crp` e `voluntary` quando criado.',
        body: z.object({
          name: z.string(),
          birth_date: z.coerce.date(),
          cpf: z.string(),
          address: z.string(),
          neighborhood: z.string(),
          number: z.number(),
          complement: z.string(),
          cepUser: z.string(),
          city: z.string(),
          uf: z.string(),
          phone: z.string(),
          email: z.email(),
          password: z.string(),
          crp: z.string(),
          voluntary: z.boolean(),
        }),
        response: {
          201: z.object({
            professional: z.object({
              person_id: z.string(),
              crp: z.string(),
              voluntary: z.boolean(),
            }),
          }),
          409: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const {
        name,
        birth_date,
        cpf,
        address,
        neighborhood,
        number,
        complement,
        cepUser,
        city,
        uf,
        phone,
        email,
        password,
        crp,
        voluntary,
      } = request.body

      const registerPersonUseCase = makePersonUseCase()

      const { person } = await registerPersonUseCase.execute({
        name,
        birth_date,
        cpf,
        cepUser,
        address,
        neighborhood,
        number,
        complement,
        city,
        uf,
        phone,
        email,
        password,
      })

      const professionalUseCase = makeRegisterProfessionalUseCase()

      try {
        const { professional } = await professionalUseCase.execute({
          person_id: person.id,
          crp,
          voluntary,
        })
        return reply.status(201).send({ professional })
      } catch (err) {
        if (err instanceof ResourceNotFoundError) {
          return reply.status(409).send({ message: 'Resource not found' })
        }
        if (err instanceof InvalidParametersError) {
          return reply.status(409).send({ message: 'Invalid parameters' })
        }
        return reply.status(409).send({ message: 'Unknown error' })
      }
    }
  )
}
