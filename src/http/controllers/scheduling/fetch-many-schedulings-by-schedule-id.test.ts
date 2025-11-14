import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createHourlies } from '@/utils/tests/create-hourlies'
import { createProfessionalAndSchedule } from '@/utils/tests/create-professional-and-schedule'
import { createUser } from '@/utils/tests/create-user'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

describe('Fetch many schedulings by schedule id', () => {
  it('should be able to fetch many schedulings by schedule id', async () => {
    const { professional, schedule } = await createProfessionalAndSchedule()
    const { user } = await createUser()

    // Define a data base como 2025-12-10
    const baseDate = new Date('2025-12-10T00:00:00.000Z')

    // Cria horários para o primeiro dia (2025-12-10)
    const day1InitialTime = new Date(baseDate)
    day1InitialTime.setUTCHours(9, 0, 0, 0)

    const day1EndTime = new Date(baseDate)
    day1EndTime.setUTCHours(19, 0, 0, 0)

    const { hourlies: hourliesDay1 } = await createHourlies(
      schedule.id,
      day1InitialTime,
      day1EndTime,
      schedule.interval ?? 0
    )

    // Cria horários para o segundo dia (2025-12-11)
    const day2Date = new Date('2025-12-11T00:00:00.000Z')
    const day2InitialTime = new Date(day2Date)
    day2InitialTime.setUTCHours(9, 0, 0, 0)

    const day2EndTime = new Date(day2Date)
    day2EndTime.setUTCHours(19, 0, 0, 0)

    const { hourlies: hourliesDay2 } = await createHourlies(
      schedule.id,
      day2InitialTime,
      day2EndTime,
      schedule.interval ?? 0
    )

    const allHourlies = [...hourliesDay1, ...hourliesDay2]

    // Cria um scheduling para cada hourly (sem duplicação)
    for (const hourly of allHourlies) {
      await prisma.scheduling.create({
        data: {
          professionalPersonId: professional.person_id,
          hourlyId: hourly.id,
          userPersonId: user.person_id,
          createdAt: new Date(),
        },
      })
    }

    // Busca a página 2 (itens 11-20) no range de datas que contém os dados criados
    const reply = await request(app.server).get(
      `/schedulings/schedule/${schedule.id}?startDate=2025-12-01&endDate=2025-12-31&page=2`
    )

    expect(reply.statusCode).toEqual(200)
    expect(reply.body.schedulings).toHaveLength(10)
  })
})
