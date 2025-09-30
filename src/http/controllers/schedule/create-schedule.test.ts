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
    vi.setSystemTime(new Date('2024-12-31T09:00:00'))

    const { professional } = await createProfessional()

    const reply = await request(app.server)
      .post(`/schedules/${professional.person_id}`)
      .send({
        initialTime: new Date('2024-12-31T09:00:00'),
        endTime: new Date('2024-12-31T17:00:00'),
        interval: 60,
        cancellationPolicy: 24,
        averageValue: 150,
        observation: 'Available for new clients',
        isControlled: true,
      })

    const createdSchedule = await prisma.schedule.findFirstOrThrow()

    const createdHourlies = await prisma.hourly.findMany({
      where: { scheduleId: createdSchedule.id },
    })

    expect(reply.statusCode).toEqual(201)
    expect(createdHourlies).toHaveLength(8)
  })
})
