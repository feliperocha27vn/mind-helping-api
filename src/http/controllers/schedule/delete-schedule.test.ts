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

describe('Delete schedule (e2e)', () => {
  it('should be able to delete a schedule', async () => {
    const { schedule } = await createProfessionalAndSchedule()

    // Cria horários para a agenda
    await prisma.hourly.createMany({
      data: [
        {
          scheduleId: schedule.id,
          date: new Date('2024-12-31T09:00:00.000Z'),
          hour: '09:00',
          isOcuped: false,
        },
        {
          scheduleId: schedule.id,
          date: new Date('2024-12-31T10:00:00.000Z'),
          hour: '10:00',
          isOcuped: false,
        },
      ],
    })

    const reply = await request(app.server).delete(`/schedules/${schedule.id}`)

    const deletedSchedule = await prisma.schedule.findUnique({
      where: { id: schedule.id },
    })

    // Verifica se os horários também foram deletados (CASCADE)
    const hourlies = await prisma.hourly.findMany({
      where: { scheduleId: schedule.id },
    })

    expect(reply.statusCode).toEqual(204)
    expect(deletedSchedule).toBeNull()
    expect(hourlies).toHaveLength(0) // Horários deletados por CASCADE
  })

  it('should return 404 when trying to delete a non-existing schedule', async () => {
    // Usa um UUID válido mas que não existe no banco
    const reply = await request(app.server).delete(
      '/schedules/550e8400-e29b-41d4-a716-446655440000'
    )

    expect(reply.statusCode).toEqual(404)
  })

  it('should return 400 when trying to delete with invalid UUID', async () => {
    const reply = await request(app.server).delete('/schedules/invalid-uuid')

    expect(reply.statusCode).toEqual(400)
  })
})
