import { NotFoundResetCodePasswordError } from '@/errors/not-found-reset-code-password-error'
import { PersonNotFoundError } from '@/errors/person-not-found'
import { ResetPasswordCodeExpiresError } from '@/errors/reset-password-code-expires-error'
import { makeVerifyResetPasswordCodeUseCase } from '@/factories/reset-password-codes/make-verify-reset-password-code-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const verifyResetPasswordCode: FastifyPluginAsyncZod = async app => {
  app.post(
    '/persons/verify-reset-password-code',
    {
      schema: {
        tags: ['Reset Password Codes'],
        summary: 'Verificar código de redefinição de senha',
        description:
          'Verifica o código de redefinição de senha fornecido para a pessoa associada ao email.',
        body: z.object({
          email: z.email(),
          code: z.string().min(4).max(4),
        }),
        response: {
          200: z.void(),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, code } = request.body

      try {
        const verifyResetPasswordCodeUseCase =
          makeVerifyResetPasswordCodeUseCase()

        await verifyResetPasswordCodeUseCase.execute({
          email,
          code,
        })

        return reply.status(200).send()
      } catch (error) {
        if (
          error instanceof PersonNotFoundError ||
          error instanceof NotFoundResetCodePasswordError ||
          error instanceof ResetPasswordCodeExpiresError
        ) {
          return reply.status(404).send({ message: error.message })
        }

        throw error
      }
    }
  )
}
