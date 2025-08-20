import { EmailAlreadyExistsError } from '@/errors/email-already-exists-error'
import { makePersonUseCase } from '@/factories/make-register-person-use-case'
import { makeRegisterUserUseCase } from '@/factories/make-register-user-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

export const registerUser: FastifyPluginAsyncZod = async app => {
  app.post(
    '/user',
    {
      schema: {
        tags: ['User'],
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

          gender: z.string().optional(),
        }),
        response: {
          201: z.object({ void: z.void() }),
          400: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
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
        gender,
      } = request.body

      try {
        const personUseCase = makePersonUseCase()

        const { person } = await personUseCase.execute({
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
        })

        const userUseCase = makeRegisterUserUseCase()

        await userUseCase.execute({
          person_id: person.id,
          gender,
        })

        reply.status(201).send()
      } catch (error) {
        if (error instanceof EmailAlreadyExistsError) {
          return reply.status(400).send({ message: error.message })
        }

        if (error instanceof Error) {
          return reply.status(500).send({ message: error.message })
        }

        return reply
          .status(500)
          .send({ message: 'An unexpected error occurred' })
      }
    }
  )
}
