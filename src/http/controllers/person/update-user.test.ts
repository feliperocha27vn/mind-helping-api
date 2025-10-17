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

describe('Update user', () => {
  it('should be able to update a user', async () => {
    const { user } = await createUser()

    const reply = await request(app.server)
      .patch(`/users/${user.person_id}`)
      .send({
        phone: '(11) 98888-felipe',
        gender: 'female',
      })

    expect(reply.statusCode).toEqual(204)
  })
})
