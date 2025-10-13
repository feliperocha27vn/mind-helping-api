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

describe('Get Number of Patients', () => {
  it('should be able to get the number of patients for a professional', async () => {
    const { professional, schedule } = await createProfessionalAndSchedule()
    const { user } = await createUser()

    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 30)

    const initialTime = new Date(futureDate)
    initialTime.setUTCHours(9, 0, 0, 0)

    const endTime = new Date(futureDate)
    endTime.setUTCHours(18, 0, 0, 0)

    const { hourlies } = await createHourlies(
      schedule.id,
      initialTime,
      endTime,
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
      `/professionals/number-patients/${professional.person_id}`
    )

    expect(reply.statusCode).toEqual(200)
    expect(reply.body.numberPatients).toEqual(1)
  })
})
