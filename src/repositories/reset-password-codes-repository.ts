import type { Prisma, ResetPasswordCodes } from '@prisma/client'

export interface ResetPasswordCodeRepository {
  create(
    data: Prisma.ResetPasswordCodesUncheckedCreateInput
  ): Promise<ResetPasswordCodes>
  getFirstByPersonId(personId: string): Promise<ResetPasswordCodes | null>
}
