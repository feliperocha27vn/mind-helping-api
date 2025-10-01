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

describe('Create new scheduling', () => {
  it('should be able to create new scheduling', async () => {
    vi.setSystemTime(new Date('2024-12-31T09:00:00'))

    const { professional, schedule } = await createProfessionalAndSchedule()
    const { user } = await createUser()
    await createHourlies(
      schedule.id,
      schedule.initialTime || new Date('2024-12-31T09:00:00.000Z'),
      schedule.endTime || new Date('2024-12-31T18:00:00.000Z'),
      schedule.interval
    )

    const reply = await request(app.server).post('/schedulings').send({
      professionalPersonId: professional.person_id,
      userPersonId: user.person_id,
      scheduleId: schedule.id,
      date: '2024-12-31',
      hour: '10:00',
    })

    const schedulingCreated = await prisma.scheduling.findFirstOrThrow({
      where: {
        userPersonId: user.person_id,
      },
    })

    expect(reply.statusCode).toEqual(201)
    expect(schedulingCreated.professionalPersonId).toEqual(
      professional.person_id
    )
  })
})
