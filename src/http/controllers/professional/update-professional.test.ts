import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createProfessional } from '@/utils/tests/create-professional'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

describe('Update professional', () => {
  it('should be able to update a professional', async () => {
    const { professional } = await createProfessional()

    const reply = await request(app.server)
      .patch(`/professionals/${professional.person_id}`)
      .send({
        phone: '(11) 98888-atualizado',
        email: 'atualizado@example.com',
      })

    expect(reply.statusCode).toEqual(204)

    const professionalUpdated = await prisma.person.findUniqueOrThrow({
      where: {
        id: professional.person_id,
      },
    })

    expect(professionalUpdated.phone).toEqual('(11) 98888-atualizado')
    expect(professionalUpdated.email).toEqual('atualizado@example.com')
  })
})
