import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import type { ResetPasswordCodeRepository } from '../reset-password-codes-repository'

export class PrismaResetPasswordCodesRepository
  implements ResetPasswordCodeRepository
{
  async create(data: Prisma.ResetPasswordCodesUncheckedCreateInput) {
    const resetPasswordCode = await prisma.resetPasswordCodes.create({
      data: {
        ...data,
        expiresAt: new Date(Date.now() + 1000 * 60 * 15),
      },
    })

    return resetPasswordCode
  }

  async getFirstByPersonId(personId: string) {
    const resetPasswordCode = await prisma.resetPasswordCodes.findFirst({
      where: {
        personId,
        expiresAt: {
          gte: new Date(),
        },
      },
    })

    return resetPasswordCode
  }
}
