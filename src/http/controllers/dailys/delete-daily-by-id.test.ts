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

describe('Delete daily', () => {
  it('should be able to delete a daily', async () => {
    const { user } = await createUser()

    const daily = await prisma.daily.create({
      data: {
        content: 'Daily to be deleted',
        userPersonId: user.person_id,
      },
    })

    const reply = await request(app.server).delete(
      `/dailys/${user.person_id}/${daily.id}`
    )

    expect(reply.statusCode).toEqual(204)
  })
})
