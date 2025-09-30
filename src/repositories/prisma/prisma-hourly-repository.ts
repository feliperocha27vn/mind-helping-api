import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import { addMinutes, format, isBefore } from 'date-fns'
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
      slotsData.push({
        id: randomUUID(),
        isOcuped: false,
        date: new Date(currentTime),
        hour: format(currentTime, 'HH:mm'),
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
}
