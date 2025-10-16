import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { InMemoryUserRepository } from '@/in-memory-repository/in-memory-user-repository'
import type { PersonRepository } from '@/repositories/person-repository'
import type { UserRepository } from '@/repositories/user-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetDataForUpdateUserUseCase } from './get-data-for-update'
import { PersonNotFoundError } from '@/errors/person-not-found'

let userRepository: UserRepository
let personRepository: PersonRepository
let sut: GetDataForUpdateUserUseCase

describe('Get data for update user use case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    personRepository = new InMemoryPersonRepository()
    sut = new GetDataForUpdateUserUseCase(userRepository, personRepository)
  })

  it('should be able to get data for update a user', async () => {
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

    const user = await userRepository.create({
      person_id: person.id,
      gender: 'female',
    })

    const { user: userData } = await sut.execute({ userId: user.person_id })

    expect(userData).toEqual(
      expect.objectContaining({
        name: 'Maria Silva Santos',
      })
    )
  })

  it('should not be able to get data for update a non existing user', async () => {
    expect(() =>
      sut.execute({ userId: 'non-existing-user-id' })
    ).rejects.toBeInstanceOf(PersonNotFoundError)
  })

  it('should not be able to retrieve data for updating if he is just one person', async () => {
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

    expect(() => sut.execute({ userId: person.id })).rejects.toBeInstanceOf(
      PersonNotFoundError
    )
  })
})
