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

describe('Get me user', () => {
  it('should be able to get the user profile', async () => {
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

    const user = await prisma.user.create({
      data: {
        person_id: person.id,
        gender: 'F',
      },
    })

    await prisma.feelingsUser.create({
      data: {
        description: 'FELIZ',
        motive: 'Hoje é um ótimo dia!',
        userPersonId: user.person_id,
      },
    })

    await prisma.goal.createMany({
      data: [
        {
          description: 'Melhorar minha saúde mental',
          userPersonId: user.person_id,
          numberDays: 30,
          isExecuted: true,
        },
        {
          description: 'Praticar exercícios físicos regularmente',
          userPersonId: user.person_id,
          numberDays: 15,
          isExecuted: true,
        },
      ],
    })

    const reply = await request(app.server).get(`/me/${user.person_id}`)

    expect(reply.statusCode).toEqual(200)
    expect(reply.body).toEqual(
      expect.objectContaining({
        profile: expect.objectContaining({
          nameUser: 'Ana Clara Oliveira',
          countExecutedGoals: 2,
        }),
      })
    )
  })
})
