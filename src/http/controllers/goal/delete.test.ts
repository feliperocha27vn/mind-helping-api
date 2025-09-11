import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

describe('Delete goal', () => {
  it('should be able to delete a goal', async () => {
    // Primeiro criar a Person
    const person = await prisma.person.create({
      data: {
        name: 'Ana Clara Oliveira',
        address: 'Avenida Brasil',
        neighborhood: 'Centro',
        number: 1500,
        complement: 'Sala 32',
        cep: '16200001',
        city: 'Birigui',
        uf: 'SP',
        phone: '(18) 99123-4567',
        email: 'ana.oliveira@example.com',
        password_hash: 'umaSenhaForte!@#',
        birth_date: new Date('1992-08-25'),
        cpf: '123.456.789-00',
      },
    })

    // Depois criar o User vinculado à Person
    const user = await prisma.user.create({
      data: {
        person_id: person.id,
        gender: 'F',
      },
    })

    const goal = await prisma.goal.create({
      data: {
        userPersonId: user.person_id, // Usar o person_id do User
        description: 'New Goal',
        numberDays: 5,
      },
    })

    const reply = await request(app.server).delete(
      `/goal/${goal.id}/${user.person_id}`
    )
    expect(reply.statusCode).toEqual(204)
  })

  it('should not be able to delete a non-existing goal', async () => {
    const reply = await request(app.server).delete(
      `/goal/c8654792-f288-4f14-a15c-74b2abb6bf2e/86ca1c65-544f-4200-be12-9df5125f607b`
    )

    expect(reply.statusCode).toEqual(404)
  })
})
