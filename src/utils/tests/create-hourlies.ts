import { randomUUID } from 'node:crypto'
import { addMinutes, isBefore } from 'date-fns'
import { prisma } from '@/lib/prisma'

export async function createHourlies(
  scheduleId: string,
  initialTime: Date,
  endTime: Date,
  interval: number
) {
  const slotsData = []
  const createdIds: string[] = []
  let currentTime = new Date(initialTime)

  while (isBefore(currentTime, endTime)) {
    // Extrai a hora em UTC para manter consistência
    const hourUTC = currentTime.getUTCHours().toString().padStart(2, '0')
    const minuteUTC = currentTime.getUTCMinutes().toString().padStart(2, '0')

    const hourlyId = randomUUID()
    createdIds.push(hourlyId)

    slotsData.push({
      id: hourlyId,
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

  // Retorna apenas os hourlies que foram criados nesta chamada
  const hourlies = await prisma.hourly.findMany({
    where: {
      id: {
        in: createdIds,
      },
    },
  })

  return { hourlies }
}
