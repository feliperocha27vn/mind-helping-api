import type { FeelingsUser, Prisma } from '@prisma/client'

export interface FeelingsRepository {
  create(data: Prisma.FeelingsUserUncheckedCreateInput): Promise<FeelingsUser>
  getLastFeelingsByUserId(userId: string): Promise<FeelingsUser | null>
  getFeelingsByDay(userId: string, day: Date): Promise<FeelingsUser[]>
}
