import { prisma } from '@/lib/prisma'
import { addMinutes, isBefore } from 'date-fns'
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
