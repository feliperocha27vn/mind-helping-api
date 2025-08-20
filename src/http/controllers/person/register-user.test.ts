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
  it('should be able to register a user', async () => {
    const reply = await request(app.server).post('/user').send({
      name: 'Ana Carolina Santos',
      birth_date: '1995-08-23',
      cpf: '12345678900',
      address: 'Rua das Acácias',
      neighborhood: 'Centro',
      number: 456,
      complement: 'Apto 12',
      cepUser: '16200001',
      city: 'Birigui',
      uf: 'SP',
      phone: '18991234567',
      email: 'ana.teste.e2e@example.com',
      password: 'SenhaForte@2025',
      gender: 'Feminino',
    })

    expect(reply.statusCode).toEqual(201)
  })
})
