import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createUser } from '@/utils/tests/create-user'
import { compare } from 'bcryptjs'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

describe('Update person password', () => {
  it('should be able to update a person password', async () => {
    const { user } = await createUser()

    const reply = await request(app.server)
      .patch(`/users/password/${user.person_id}`)
      .send({
        repeatPassword: 'new-hashed-password',
        newPassword: 'new-hashed-password',
      })

    expect(reply.statusCode).toEqual(204)

    const personUpdated = await prisma.person.findUniqueOrThrow({
      where: { id: user.person_id },
    })

    const doesPasswordMatch = await compare(
      'new-hashed-password',
      personUpdated.password_hash
    )

    expect(doesPasswordMatch).toBe(true)
  })
})
