import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createProfessionalAndSchedule } from '@/utils/tests/create-professional-and-schedule'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

describe('Create new hourly', () => {
  it('should be able to create a new hourly', async () => {
    const { schedule } = await createProfessionalAndSchedule()

    const reply = await request(app.server).post(`/hourlies`).send({
      scheduleId: schedule.id,
      date: new Date(),
      hour: '10:00',
    })

    expect(reply.statusCode).toEqual(201)

    const hourly = await prisma.hourly.findFirstOrThrow()

    expect(hourly.scheduleId).toEqual(schedule.id)
  })
})
