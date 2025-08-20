import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { InvalidParametersError } from '../../../errors/invalid-parameters'
import { ResourceNotFoundError } from '../../../errors/resource-not-found-error'
import { makePersonUseCase } from '../../../factories/make-register-person-use-case'
import { makeRegisterProfessionalUseCase } from '../../../factories/make-register-professional-use-case'

export const registerProfessional: FastifyPluginAsyncZod = async app => {
  app.post(
    '/professional',
    {
      schema: {
        tags: ['Professional'],
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
        await professionalUseCase.execute({
          person_id: person.id,
          crp,
          voluntary,
        })
      } catch (err) {
        if (err instanceof ResourceNotFoundError) {
          return reply.status(409).send()
        }

        if (err instanceof InvalidParametersError) {
          return reply.status(409).send()
        }
      }

      return reply.status(201).send()
    }
  )
}
