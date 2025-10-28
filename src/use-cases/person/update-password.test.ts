import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import type { PersonRepository } from '@/repositories/person-repository'
import { compare, hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { UpdatePasswordPersonUseCase } from './update-password'

let personRepository: PersonRepository
let sut: UpdatePasswordPersonUseCase

describe('Update password use case', () => {
  beforeEach(() => {
    personRepository = new InMemoryPersonRepository()
    sut = new UpdatePasswordPersonUseCase(personRepository)
  })

  it('should be able to update a user password', async () => {
    const personCreated = await personRepository.create({
      id: 'person-01',
      name: 'Maria Silva Santos',
      birth_date: '1985-03-15',
      cpf: '123.456.789-00',
      address: 'Rua das Flores',
      neighborhood: 'Centro',
      number: 1232,
      complement: 'Sala 201',
      cep: '01234-567',
      city: 'São Paulo',
      uf: 'SP',
      phone: '(11) 99999-8888',
      email: 'maria.santos@email.com',
      password_hash: await hash('senha123', 6),
    })

    const { person } = await sut.execute({
      personId: personCreated.id,
      passwordCurrent: 'senha123',
      newPassword: 'novasenha456',
    })

    const doesPasswordMatch = await compare(
      'novasenha456',
      person.password_hash
    )

    expect(doesPasswordMatch).toBe(true)
  })
})
