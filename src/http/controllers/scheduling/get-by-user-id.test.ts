import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createHourlies } from '@/utils/tests/create-hourlies'
import { createProfessionalAndSchedule } from '@/utils/tests/create-professional-and-schedule'
import { createUser } from '@/utils/tests/create-user'
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

describe('Get scheduling by user ID', () => {
  it('should be able to get scheduling by user ID', async () => {
    vi.setSystemTime(new Date('2024-12-31T09:00:00'))

    const { professional, schedule } = await createProfessionalAndSchedule()
    const { user } = await createUser()
    const { hourlies } = await createHourlies(
      schedule.id,
      schedule.initialTime || new Date('2024-12-31T09:00:00.000Z'),
      schedule.endTime || new Date('2024-12-31T18:00:00.000Z'),
      schedule.interval
    )

    await prisma.scheduling.create({
      data: {
        professionalPersonId: professional.person_id,
        userPersonId: user.person_id,
        hourlyId: hourlies[0].id,
      },
    })

    const reply = await request(app.server).get(
      `/schedulings/${user.person_id}`
    )

    expect(reply.status).toBe(200)
    expect(reply.body.schedulingDetails).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      })
    )
  })
})
