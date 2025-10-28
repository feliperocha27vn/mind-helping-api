import { PrismaPersonRepository } from '@/repositories/prisma/prisma-person-repository'
import { PrismaResetPasswordCodesRepository } from '@/repositories/prisma/prisma-reset-password-codes-repository'
import { ForgotPasswordUseCase } from '@/use-cases/person/forgot-password'

export function makeForgotPasswordUseCase() {
  const prismaPersonRepository = new PrismaPersonRepository()
  const prismaResetPasswordCodeRepository =
    new PrismaResetPasswordCodesRepository()
  const forgotPasswordUseCase = new ForgotPasswordUseCase(
    prismaPersonRepository,
    prismaResetPasswordCodeRepository
  )

  return forgotPasswordUseCase
}
