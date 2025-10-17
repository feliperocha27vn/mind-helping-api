import { app } from '@/app'
import { createUser } from '@/utils/tests/create-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

describe('Get data for update', () => {
  it('should be able to get data for update', async () => {
    const { user } = await createUser()

    const reply = await request(app.server).get(
      `/users/data-for-update/${user.person_id}`
    )

    expect(reply.statusCode).toEqual(200)
    expect(reply.body.user).toEqual(
      expect.objectContaining({
        name: 'Roberto Silva',
      })
    )
  })
})
