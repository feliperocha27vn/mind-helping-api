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

describe('Get daily by ID', () => {
  it('should be able to get a daily by ID', async () => {
    const { user } = await createUser()
    const { dailys } = await createDailys(user.person_id)

    const reply = await request(app.server).get(
      `/dailys/${user.person_id}/${dailys[0].id}`
    )

    expect(reply.statusCode).toEqual(200)
    expect(reply.body.daily).toEqual(
      expect.objectContaining({
        content: 'Today I felt great!',
      })
    )
  })
})
