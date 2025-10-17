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

describe('Create daily', () => {
  it('should be able to create a daily', async () => {
    const { user } = await createUser()

    const reply = await request(app.server)
      .post(`/dailys/${user.person_id}`)
      .send({
        content: 'Today I felt great!',
      })

    expect(reply.statusCode).toEqual(201)

    const daily = await prisma.daily.findFirstOrThrow({
      where: {
        userPersonId: user.person_id,
      },
    })

    expect(daily).toEqual(
      expect.objectContaining({
        content: 'Today I felt great!',
        userPersonId: user.person_id,
      })
    )
  })
})
