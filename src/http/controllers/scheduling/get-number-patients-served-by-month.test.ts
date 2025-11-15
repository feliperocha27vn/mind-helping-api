import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createHourlies } from '@/utils/tests/create-hourlies'
import { createProfessionalAndSchedule } from '@/utils/tests/create-professional-and-schedule'
import { createUser } from '@/utils/tests/create-user'

beforeAll(async () => {
  await app.ready()

  vi.useFakeTimers()
})

afterAll(async () => {
  await app.close()

  vi.useRealTimers()
})

describe('Get number of patients served by month', () => {
  it('should be able to get number of patients served by month', async () => {
    vi.setSystemTime(new Date('2024-12-31T09:00:00'))

    const { professional, schedule } = await createProfessionalAndSchedule()
    const { user } = await createUser()
    const { hourlies } = await createHourlies(
      schedule.id,
      schedule.initialTime || new Date('2024-12-31T09:00:00.000Z'),
      schedule.endTime || new Date('2024-12-31T18:00:00.000Z'),
      schedule.interval ?? 0
    )

    await prisma.scheduling.create({
      data: {
        professionalPersonId: professional.person_id,
        userPersonId: user.person_id,
        hourlyId: hourlies[0].id,
        onFinishedConsultation: true,
        createdAt: new Date('2024-12-24T09:00:00.000Z'),
      },
    })

    await prisma.scheduling.create({
      data: {
        professionalPersonId: professional.person_id,
        userPersonId: user.person_id,
        hourlyId: hourlies[1].id,
        onFinishedConsultation: true,
        createdAt: new Date('2024-12-31T09:00:00.000Z'),
      },
    })

    const reply = await request(app.server).get(
      `/professionals/number-of-patients-served/${professional.person_id}?month=11`
    )

    expect(reply.status).toBe(200)
    expect(reply.body).toEqual({ numberPatientsServedByMonth: 2 })
  })
})
