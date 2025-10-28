import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import type { ResetPasswordCodeRepository } from '../reset-password-codes-repository'

export class PrismaResetPasswordCodesRepository
  implements ResetPasswordCodeRepository
{
  async create(data: Prisma.ResetPasswordCodesUncheckedCreateInput) {
    await prisma.resetPasswordCodes.create({
      data,
    })
  }
}
