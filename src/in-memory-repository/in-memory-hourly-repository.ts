import type { HourlyRepository } from '@/repositories/hourly-repository'
import type { Hourly, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export class InMemoryHourlyRepository implements HourlyRepository {
  public items: Hourly[] = []

  async createMany(data: Prisma.HourlyUncheckedCreateInput[]) {
    const hourlies = data.map(item => {
      const hourly = {
        id: item.id ?? randomUUID(),
        scheduleId: item.scheduleId ?? randomUUID(),
        date: new Date(item.date ?? new Date()),
        hour: item.hour,
        isOcuped: item.isOcuped ?? false,
      }

      this.items.push(hourly)

      return hourly
    })

    return hourlies
  }

  async fetchManyByScheduleId(scheduleId: string) {
    const hourlies = this.items.filter(item => item.scheduleId === scheduleId)

    return hourlies
  }
}
