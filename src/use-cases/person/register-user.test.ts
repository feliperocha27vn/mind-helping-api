import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { InMemoryUserRepository } from '@/in-memory-repository/in-memory-user-repository'
import type { PersonRepository } from '@/repositories/person-repository'
import type { UserRepository } from '@/repositories/user-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterUserUseCase } from './register-user'

let userRepository: UserRepository
let personRepository: PersonRepository
let sut: RegisterUserUseCase

describe('Register user use case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    personRepository = new InMemoryPersonRepository()
    sut = new RegisterUserUseCase(userRepository, personRepository)
  })

  it('should be able to register a user', async () => {
    const person = await personRepository.create({
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

    const { user } = await sut.execute({
      person_id: person.id,
      gender: 'female',
    })

    expect(user.person_id).toEqual(expect.any(String))
  })
})
