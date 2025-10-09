import type { FeelingsUser, Prisma } from '@prisma/client'

export interface FeelingsRepository {
  create(data: Prisma.FeelingsUserUncheckedCreateInput): Promise<FeelingsUser>
  getLastFeelingsByUserId(userId: string): Promise<FeelingsUser | null>
  getFeelingsByDate(
    userId: string,
    startDay: Date,
    endDay: Date
  ): Promise<FeelingsUser[]>
}
