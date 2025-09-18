import type { HourlyRepository } from '@/repositories/hourly-repository'
import type { Hourly, Prisma } from '@prisma/client'
import { addMinutes, format, isBefore } from 'date-fns'
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

  async createHourlySlots(
    scheduleId: string,
    initialTime: Date,
    endTime: Date,
    interval: number
  ): Promise<Hourly[]> {
    const createdHourlies: Hourly[] = []
    let currentTime = new Date(initialTime)

    while (isBefore(currentTime, endTime)) {
      const hourly = {
        id: randomUUID(),
        isOcuped: false,
        date: new Date(currentTime),
        hour: format(currentTime, 'HH:mm'),
        scheduleId,
      }

      this.items.push(hourly)
      createdHourlies.push(hourly)

      currentTime = addMinutes(currentTime, interval)
    }

    return createdHourlies
  }
}
