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

describe('Create feeling user', () => {
  it('should be able to create a new feeling for the user', async () => {
    const { user } = await createUser()

    const reply = await request(app.server)
      .post(`/feelings/${user.person_id}`)
      .send({
        description: 'FELIZ',
        motive: 'Hoje é um ótimo dia!',
      })

    expect(reply.statusCode).toEqual(201)
  })
})
