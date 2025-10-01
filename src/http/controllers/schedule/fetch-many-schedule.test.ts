import { app } from '@/app'
import { createProfessionalAndSchedule } from '@/utils/tests/create-professional-and-schedule'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

beforeAll(async () => {
  await app.ready()

  vi.useFakeTimers()
})

afterAll(async () => {
  await app.close()

  vi.useRealTimers()
})

describe('Fetch many schedules', () => {
  it('should be able to fetch many schedules', async () => {
    const { professional } = await createProfessionalAndSchedule()

    const reply = await request(app.server).get(
      `/schedules/${professional.person_id}`
    )

    expect(reply.statusCode).toEqual(200)
    expect(reply.body.schedules).toHaveLength(1)
  })
})
