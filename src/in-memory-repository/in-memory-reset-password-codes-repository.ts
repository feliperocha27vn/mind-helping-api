import type { ResetPasswordCodeRepository } from '@/repositories/reset-password-codes-repository'
import type { Prisma, ResetPasswordCodes } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export class InMemoryResetPasswordCodesRepository
  implements ResetPasswordCodeRepository
{
  public items: ResetPasswordCodes[] = []

  async create(data: Prisma.ResetPasswordCodesUncheckedCreateInput) {
    const resetPasswordCode = {
      id: data.id ?? randomUUID(),
      personId: data.personId,
      code: data.code,
      createdAt: new Date(),
    }

    this.items.push(resetPasswordCode)
  }
}
