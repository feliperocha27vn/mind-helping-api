import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createUser } from '@/utils/tests/create-user'
import { hash } from 'bcryptjs'
import { addMinutes } from 'date-fns'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

describe('Verify reset password code', () => {
  it('should be able verify reset password code', async () => {
    const { person } = await createUser()

    await prisma.resetPasswordCodes.create({
      data: {
        personId: person.id,
        code: await hash('1234', 6),
        expiresAt: addMinutes(new Date(), 15),
      },
    })

    const reply = await request(app.server)
      .post('/persons/verify-reset-password-code')
      .send({
        email: person.email,
        code: '1234',
      })

    expect(reply.statusCode).toEqual(200)
  })
})
