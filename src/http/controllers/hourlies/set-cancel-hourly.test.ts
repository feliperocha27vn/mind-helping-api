import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createHourlies } from '@/utils/tests/create-hourlies'
import { createProfessionalAndSchedule } from '@/utils/tests/create-professional-and-schedule'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

describe('Set cancel hourly', () => {
  it('should be able to set a cancel hourly', async () => {
    const { schedule } = await createProfessionalAndSchedule()
    const { hourlies } = await createHourlies(
      schedule.id,
      schedule.initialTime || new Date(),
      schedule.endTime || new Date(),
      schedule.interval || 60
    )

    const reply = await request(app.server).patch(`/hourlies/${hourlies[0].id}`)

    expect(reply.statusCode).toEqual(204)

    const hourly = await prisma.hourly.findUniqueOrThrow({
      where: { id: hourlies[0].id },
    })

    expect(hourly.isOcuped).toBe(false)
  })
})
