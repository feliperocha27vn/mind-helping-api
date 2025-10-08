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

describe('Create new scheduling', () => {
  it('should be able to create new scheduling', async () => {
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

    // Formata a data no formato YYYY-MM-DD
    const year = futureDate.getUTCFullYear()
    const month = String(futureDate.getUTCMonth() + 1).padStart(2, '0')
    const day = String(futureDate.getUTCDate()).padStart(2, '0')
    const dateString = `${year}-${month}-${day}`

    await createHourlies(schedule.id, initialTime, endTime, schedule.interval)

    const reply = await request(app.server).post('/schedulings').send({
      professionalPersonId: professional.person_id,
      userPersonId: user.person_id,
      scheduleId: schedule.id,
      date: dateString,
      hour: '10:00',
    })

    expect(reply.statusCode).toEqual(201)

    const schedulingCreated = await prisma.scheduling.findFirstOrThrow({
      where: {
        userPersonId: user.person_id,
      },
    })

    expect(schedulingCreated.professionalPersonId).toEqual(
      professional.person_id
    )
  })
})
