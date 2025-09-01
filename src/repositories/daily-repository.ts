import type { Daily, Prisma } from '@prisma/client'

export interface DailyRepository {
  create(data: Prisma.DailyUncheckedCreateInput): Promise<Daily>
}
