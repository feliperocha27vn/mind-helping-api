import { app } from '@/app'
import { createDailys } from '@/utils/tests/create-dailys'
import { createUser } from '@/utils/tests/create-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

describe('Create daily', () => {
  it('should be able to create a daily', async () => {
    const { user } = await createUser()
    const { dailys } = await createDailys(user.person_id)

    const reply = await request(app.server)
      .get(`/dailys/${user.person_id}`)
      .query({
        startDay: new Date('2023-01-01T00:00:00Z'),
        endDay: new Date('2023-01-20T23:59:59Z'),
      })

    expect(reply.statusCode).toEqual(200)
    expect(reply.body.dailys).toHaveLength(dailys.length)
  })
})
