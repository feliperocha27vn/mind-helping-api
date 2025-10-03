import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import { addMinutes, isBefore } from 'date-fns'
import { randomUUID } from 'node:crypto'
import type { HourlyRepository } from '../hourly-repository'

export class PrismaHourlyRepository implements HourlyRepository {
  async createMany(data: Prisma.HourlyUncheckedCreateInput[]) {
    await prisma.hourly.createMany({
      data,
    })

    const hourlies = await prisma.hourly.findMany({
      where: {
        scheduleId: data[0]?.scheduleId,
      },
    })

    return hourlies
  }

  async createHourlySlots(
    scheduleId: string,
    initialTime: Date,
    endTime: Date,
    interval: number
  ) {
    const slotsData = []
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

  async fetchManyByScheduleId(scheduleId: string) {
    const hourlies = await prisma.hourly.findMany({
      where: {
        scheduleId,
      },
    })

    return hourlies
  }

  async getHourlyByDateAndHour(date: Date, hour: string) {
    const hourly = await prisma.hourly.findFirst({
      where: {
        date,
        hour,
      },
    })

    return hourly
  }

  async updateStatusOcuped(hourlyId: string) {
    const hourly = await prisma.hourly.update({
      where: {
        id: hourlyId,
      },
      data: {
        isOcuped: true,
      },
    })

    return hourly
  }

  async getById(id: string) {
    const hourly = await prisma.hourly.findUnique({
      where: {
        id,
      },
    })

    return hourly
  }
}
