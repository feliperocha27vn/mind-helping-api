import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createUser } from '@/utils/tests/create-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

describe('Create CVV Call', () => {
  it('should be able to create a CVV Call', async () => {
    const { user } = await createUser()

    const reply = await request(app.server)
      .post(`/cvv-calls/${user.person_id}`)
      .send({
        dateCalled: new Date().toISOString(),
        timeCalled: '52:12',
      })

    expect(reply.statusCode).toEqual(201)

    const cvvCall = await prisma.cvvCalls.findFirst({
      where: {
        userPersonId: user.person_id,
      },
    })

    expect(cvvCall).toEqual(
      expect.objectContaining({
        userPersonId: user.person_id,
      })
    )
  })
})
