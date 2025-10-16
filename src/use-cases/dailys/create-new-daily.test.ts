import { InMemoryUserRepository } from '@/in-memory-repository/in-memory-user-repository'
import type { UserRepository } from '@/repositories/user-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateNewDaily } from './create-new-daily'
import type { DailyRepository } from '@/repositories/daily-repository'
import { InMemoryDailyRepository } from '@/in-memory-repository/in-memory-daily-repository'
import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { PersonNotFoundError } from '@/errors/person-not-found'

let userRepository: UserRepository
let dailyRepository: DailyRepository
const personRepository = new InMemoryPersonRepository()
let sut: CreateNewDaily

describe('Create new daily', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    dailyRepository = new InMemoryDailyRepository()
    sut = new CreateNewDaily(dailyRepository, userRepository)
  })

  it('should be able to create a new daily', async () => {
    const person = await personRepository.create({
      id: 'user-01',
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
      gender: 'female',
      person_id: person.id,
    })

    const { daily } = await sut.execute({
      userId: user.person_id,
      content: 'Today I worked on the project and made significant progress.',
    })

    expect(daily.content).toEqual(
      'Today I worked on the project and made significant progress.'
    )
    expect(daily.userPersonId).toEqual(user.person_id)
  })

  it('should not be able to create a new daily with non existing user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-user-id',
        content: 'Today I worked on the project and made significant progress.',
      })
    ).rejects.toBeInstanceOf(PersonNotFoundError)
  })
})
