import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createHourlies } from '@/utils/tests/create-hourlies'
import { createProfessionalAndSchedule } from '@/utils/tests/create-professional-and-schedule'
import { createUser } from '@/utils/tests/create-user'
import { addMonths } from 'date-fns'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

describe('Fetch schedulings by professional id', () => {
  it('should be able to fetch schedulings by professional id', async () => {
    const { professional, schedule } = await createProfessionalAndSchedule()
    const { user } = await createUser()

    // Usa uma data futura (30 dias a partir de agora)
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 30)

    // Define horários para o dia (09:00 às 18:00)
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
        hourlyId: hourlies[0].id,
        userPersonId: user.person_id,
        createdAt: addMonths(new Date(), 1),
      },
    })

    const reply = await request(app.server)
      .get(
        `/schedulings/professional/${professional.person_id}?startDate=2025-12-01&endDate=2025-12-30`
      )
      .send({
        professionalPersonId: professional.person_id,
      })

    expect(reply.statusCode).toEqual(200)
    expect(reply.body.schedulings).toHaveLength(1)
  })
})
