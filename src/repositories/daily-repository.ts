import type { Daily, Prisma } from '@prisma/client'

export interface DailyRepository {
  create(data: Prisma.DailyUncheckedCreateInput): Promise<Daily>
  fetchDailysByDateRangeAndUserId(
    userId: string,
    startDay: Date,
    endDay: Date
  ): Promise<Daily[]>
  deleteById(dailyId: string, userId: string): Promise<void>
  getById(dailyId: string, userId: string): Promise<Daily | null>
}
