import { app } from '@/app'
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

describe('Fetch hourlies by schedule ID', () => {
  it('should be able to fetch hourlies by schedule ID', async () => {
    const { schedule } = await createProfessionalAndSchedule()
    await createHourlies(
      schedule.id,
      schedule.initialTime || new Date(),
      schedule.endTime || new Date(),
      schedule.interval || 60
    )

    const reply = await request(app.server)
      .get(`/hourlies/${schedule.id}`)
      .send()

    expect(reply.statusCode).toEqual(200)
  })
})
