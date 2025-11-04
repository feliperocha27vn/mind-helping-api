import { env } from '@/env'
import { PersonNotFoundError } from '@/errors/person-not-found'
import { makeForgotPasswordUseCase } from '@/factories/person/make-forgot-password-use-case'
import { transporterConfig } from '@/lib/node-mailer'
import { getResetPasswordEmailText } from '@/utils/texts-from-email'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const forgotPassword: FastifyPluginAsyncZod = async app => {
  app.post(
    '/persons/forgot-password',
    {
      schema: {
        tags: ['Persons'],
        summary: 'Solicitar redefinição de senha',
        description:
          'Envia um email com o código de redefinição de senha para a pessoa associada ao email fornecido. Retorna o código de redefinição gerado para fins de teste.',
        body: z.object({
          email: z.email(),
        }),
        response: {
          200: z.void(),
          404: z.object({
            message: z.string(),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body

      try {
        const forgotPasswordUseCase = makeForgotPasswordUseCase()

        const { resetCode } = await forgotPasswordUseCase.execute({
          email,
        })

        const { emailText } = getResetPasswordEmailText(resetCode)

        await transporterConfig.sendMail({
          from: `Mind Helping <${env.EMAIL_FROM}>`,
          to: email,
          subject: emailText.subjectText,
          text: emailText.setText,
          html: emailText.htmlText,
        })

        return reply.status(200).send()
      } catch (error) {
        if (error instanceof PersonNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        throw error
      }
    }
  )
}
