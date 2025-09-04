import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

describe('Register Professional Controller', () => {
  it('should be able to register a professional', async () => {
    const reply = await request(app.server).post('/professional').send({
      name: 'Ana Clara Oliveira',
      birth_date: '1992-08-25',
      cpf: '123.456.789-00',
      address: 'Avenida Brasil',
      neighborhood: 'Centro',
      number: 1500,
      complement: 'Sala 32',
      cepUser: '16200-001',
      city: 'Birigui',
      uf: 'SP',
      phone: '(18) 99123-4567',
      email: 'ana.oliveira@example.com',
      password: 'umaSenhaForte!@#',
      crp: '06/123456',
      voluntary: true,
    })

    expect(reply.statusCode).toEqual(201)
  })
})
