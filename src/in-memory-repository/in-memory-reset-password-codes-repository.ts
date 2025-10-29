import type { ResetPasswordCodeRepository } from '@/repositories/reset-password-codes-repository'
import type { Prisma, ResetPasswordCodes } from '@prisma/client'
import { addMinutes } from 'date-fns'
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
      expiresAt: addMinutes(new Date(), 15),
    }

    this.items.push(resetPasswordCode)

    return resetPasswordCode
  }

  async getFirstByPersonId(personId: string) {
    const resetPasswordCode = this.items.find(
      item => item.personId === personId
    )

    if (!resetPasswordCode) {
      return null
    }

    return resetPasswordCode
  }
}
