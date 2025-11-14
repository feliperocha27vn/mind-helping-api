import { randomUUID } from 'node:crypto'
import type { Hourly, Prisma } from '@prisma/client'
import { addMinutes, isBefore, isWithinInterval } from 'date-fns'
import type { HourlyRepository } from '@/repositories/hourly-repository'

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

  async updateStatusOcuped(hourlyId: string) {
    const hourly = this.items.find(item => item.id === hourlyId)

    if (!hourly) {
      return null
    }

    hourly.isOcuped = true

    return hourly
  }

  async getById(id: string) {
    const hourly = this.items.find(item => item.id === id) || null

    return hourly
  }

  async setCancelHourly(hourlyId: string) {
    const hourly = this.items.find(item => item.id === hourlyId)

    if (!hourly) {
      return null
    }

    hourly.isOcuped = false

    return hourly
  }

  async create(data: Prisma.HourlyUncheckedCreateInput) {
    const hourly = {
      id: data.id ?? randomUUID(),
      scheduleId: data.scheduleId,
      date: new Date(data.date ?? new Date()),
      hour: data.hour,
      isOcuped: data.isOcuped ?? false,
    }

    this.items.push(hourly)

    return hourly
  }

  async fetchManyByScheduleIdAndDate(
    scheduleId: string,
    startDate: Date,
    endDate: Date,
    page: number
  ) {
    const hourliesByDate = this.items
      .filter(item => {
        const scheduleIsMatch = item.scheduleId === scheduleId
        const dateInRange = isWithinInterval(item.date, {
          start: startDate,
          end: endDate,
        })

        return scheduleIsMatch && dateInRange
      })
      .slice((page - 1) * 10, page * 10)

    if (hourliesByDate.length === 0) {
      return []
    }

    return hourliesByDate
  }
}
