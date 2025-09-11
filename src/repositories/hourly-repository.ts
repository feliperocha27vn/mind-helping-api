import type { Hourly, Prisma } from '@prisma/client'

export interface HourlyRepository {
  createMany(data: Prisma.HourlyUncheckedCreateInput[]): Promise<Hourly[]>
  fetchManyByScheduleId(scheduleId: string): Promise<Hourly[]>
}
