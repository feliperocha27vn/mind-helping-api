import { prisma } from '@/lib/prisma'
import { addMinutes, format, isBefore } from 'date-fns'
import { randomUUID } from 'node:crypto'

export async function createHourlies(
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

  await prisma.hourly.createMany({
    data: slotsData,
  })

  const hourlies = await prisma.hourly.findMany({
    where: {
      scheduleId,
    },
  })

  return { hourlies }
}
