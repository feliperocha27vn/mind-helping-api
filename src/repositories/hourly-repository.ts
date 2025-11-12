import type { Hourly, Prisma } from '@prisma/client'

export interface HourlyRepository {
  createMany(data: Prisma.HourlyUncheckedCreateInput[]): Promise<Hourly[]>
  fetchManyByScheduleId(scheduleId: string): Promise<Hourly[]>
  createHourlySlots(
    scheduleId: string,
    initialTime: Date,
    endTime: Date,
    interval: number
  ): Promise<Hourly[]>
  getHourlyByDateAndHour(date: Date, hour: string): Promise<Hourly | null>
  updateStatusOcuped(hourlyId: string): Promise<Hourly | null>
  getById(id: string): Promise<Hourly | null>
  setCancelHourly(hourlyId: string): Promise<Hourly | null>
  create(data: Prisma.HourlyUncheckedCreateInput): Promise<Hourly>
}
