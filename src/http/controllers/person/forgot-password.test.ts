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

describe('Forgot password', () => {
  it.skip('should be able to send a forgot password email', async () => {
    const { person } = await createUser()

    const reply = await request(app.server)
      .post('/persons/forgot-password')
      .send({
        email: person.email,
      })

    expect(reply.statusCode).toEqual(200)
    expect(reply.body.resetCode).toHaveLength(4)
  })
})
