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

describe('Delete user', () => {
  it('should be able to delete a user', async () => {
    const { user } = await createUser()

    const reply = await request(app.server).delete(`/persons/${user.person_id}`)

    expect(reply.statusCode).toEqual(204)

    const personDeletedSoft = await prisma.person.findUniqueOrThrow({
      where: { id: user.person_id },
    })

    expect(personDeletedSoft.isDeleted).toEqual(true)
  })
})
