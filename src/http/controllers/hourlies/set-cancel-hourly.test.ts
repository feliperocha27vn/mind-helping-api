import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createHourlies } from '@/utils/tests/create-hourlies'
import { createProfessionalAndSchedule } from '@/utils/tests/create-professional-and-schedule'
import { createUser } from '@/utils/tests/create-user'
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
    const { user } = await createUser()
    const { hourlies } = await createHourlies(
      schedule.id,
      schedule.initialTime || new Date(),
      schedule.endTime || new Date(),
      schedule.interval || 60
    )

    const scheduling = await prisma.scheduling.create({
      data: {
        userPersonId: user.person_id,
        professionalPersonId: schedule.professionalPersonId,
        hourlyId: hourlies[0].id,
      },
    })

    const reply = await request(app.server).patch(
      `/hourlies/${hourlies[0].id}/${scheduling.id}`
    )

    expect(reply.statusCode).toEqual(204)

    const hourly = await prisma.hourly.findUniqueOrThrow({
      where: { id: hourlies[0].id },
    })

    const schedulingUpdated = await prisma.scheduling.findUniqueOrThrow({
      where: { id: scheduling.id },
    })

    expect(hourly.isOcuped).toBe(false)
    expect(schedulingUpdated.isCanceled).toBe(true)
  })
})
