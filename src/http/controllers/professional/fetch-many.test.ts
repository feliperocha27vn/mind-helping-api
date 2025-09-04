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

describe('Fetch Many Professionals', () => {
  it('should be able to fetch many professionals', async () => {
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

    await prisma.professional.create({
      data: {
        crp: '06/123456',
        voluntary: true,
        person_id: person.id,
      },
    })

    const reply = await request(app.server).get('/professionals').query({
      search: 'Ana',
    })

    console.log(reply.body)

    expect(reply.statusCode).toEqual(200)
    expect(reply.body.professionals).toBeInstanceOf(Array)
  })
})
