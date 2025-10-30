import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createUser } from '@/utils/tests/create-user'
import { addDays } from 'date-fns'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

describe('Get CVV Calls by Person ID', () => {
  it('should be able to get all CVV Calls for a user', async () => {
    const { user } = await createUser()

    await prisma.cvvCalls.createMany({
      data: [
        {
          dateCalled: new Date(),
          timeCalled: '52:10',
          userPersonId: user.person_id,
        },
        {
          dateCalled: addDays(new Date(), 3),
          timeCalled: '53:41',
          userPersonId: user.person_id,
        },
      ],
    })

    const reply = await request(app.server).get(`/cvv-calls/${user.person_id}`)

    expect(reply.statusCode).toEqual(200)
    expect(reply.body.cvvCalls).toHaveLength(2)
  })
})
