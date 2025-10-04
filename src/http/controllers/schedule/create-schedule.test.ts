import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createProfessional } from '@/utils/tests/create-professional'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

beforeAll(async () => {
  await app.ready()

  vi.useFakeTimers()
})

afterAll(async () => {
  await app.close()

  vi.useRealTimers()
})

describe('Create new schedule', () => {
  it('should be able to create new schedule', async () => {
    vi.setSystemTime(new Date('2024-11-20T09:00:00'))

    const { professional } = await createProfessional()

    const reply = await request(app.server)
      .post(`/schedules/${professional.person_id}`)
      .send([
        {
          initialTime: new Date('2024-12-01T09:00:00.000Z'),
          endTime: new Date('2024-12-01T17:00:00.000Z'),
          interval: 60,
          cancellationPolicy: 24,
          averageValue: 150,
          observation: 'Available for new clients',
          isControlled: true,
        },
        {
          initialTime: new Date('2024-12-02T09:00:00.000Z'),
          endTime: new Date('2024-12-02T16:00:00.000Z'),
          interval: 60,
          cancellationPolicy: 24,
          averageValue: 150,
          observation: 'Available for new clients',
          isControlled: true,
        },
      ])

    const createdSchedules = await prisma.schedule.findMany({
      where: { professionalPersonId: professional.person_id },
      orderBy: { initialTime: 'asc' },
    })

    const createdHourliesFirst = await prisma.hourly.findMany({
      where: { scheduleId: createdSchedules[0].id },
      orderBy: { date: 'asc' },
    })

    const createdHourliesSecond = await prisma.hourly.findMany({
      where: { scheduleId: createdSchedules[1].id },
      orderBy: { date: 'asc' },
    })

    expect(reply.statusCode).toEqual(201)
    expect(createdSchedules).toHaveLength(2) // Deve criar 2 schedules
    expect(createdHourliesFirst).toHaveLength(8) // 09:00 até 16:00 com intervalo de 60min = 8 slots (09,10,11,12,13,14,15,16)
    expect(createdHourliesSecond).toHaveLength(7) // 09:00 até 16:00 com intervalo de 60min = 7 slots (09,10,11,12,13,14,15)
  })
})
