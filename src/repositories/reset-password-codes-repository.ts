import type { Prisma } from '@prisma/client'

export interface ResetPasswordCodeRepository {
  create(data: Prisma.ResetPasswordCodesUncheckedCreateInput): Promise<void>
}
