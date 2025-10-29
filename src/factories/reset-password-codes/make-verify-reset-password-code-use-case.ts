import { PrismaPersonRepository } from '@/repositories/prisma/prisma-person-repository'
import { PrismaResetPasswordCodesRepository } from '@/repositories/prisma/prisma-reset-password-codes-repository'
import { VerifyResetPasswordCodeUseCase } from '@/use-cases/reset-password-codes/verify-reset-password-code-use-case'

export function makeVerifyResetPasswordCodeUseCase() {
  const prismaResetPasswordCodeRepository =
    new PrismaResetPasswordCodesRepository()
  const prismaPersonRepository = new PrismaPersonRepository()
  const verifyResetPasswordCodeUseCase = new VerifyResetPasswordCodeUseCase(
    prismaResetPasswordCodeRepository,
    prismaPersonRepository
  )

  return verifyResetPasswordCodeUseCase
}
