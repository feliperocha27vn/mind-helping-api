import type { HourlyRepository } from '@/repositories/hourly-repository'
import type { Hourly, Prisma } from '@prisma/client'
import { addMinutes, isBefore } from 'date-fns'
import { randomUUID } from 'node:crypto'

export class InMemoryHourlyRepository implements HourlyRepository {
  public items: Hourly[] = []

  async createMany(data: Prisma.HourlyUncheckedCreateInput[]) {
    const hourlies = data.map(item => {
      const hourly = {
        id: item.id ?? randomUUID(),
        scheduleId: item.scheduleId,
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
  ) {
    const slotsData: Hourly[] = []
    let currentTime = new Date(initialTime)

    while (isBefore(currentTime, endTime)) {
      // Extrai a hora em UTC para manter consistência
      const hourUTC = currentTime.getUTCHours().toString().padStart(2, '0')
      const minuteUTC = currentTime.getUTCMinutes().toString().padStart(2, '0')

      slotsData.push({
        id: randomUUID(),
        isOcuped: false,
        date: new Date(currentTime),
        hour: `${hourUTC}:${minuteUTC}`,
        scheduleId,
      })
      currentTime = addMinutes(currentTime, interval)
    }

    return this.createMany(slotsData)
  }

  async getHourlyByDateAndHour(date: Date, hour: string) {
    const hourly = this.items.find(
      item => item.date.getTime() === date.getTime() && item.hour === hour
    )

    if (!hourly) {
      return null
    }

    return hourly
  }
}
