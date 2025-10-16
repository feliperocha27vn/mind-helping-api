import { InMemoryUserRepository } from '@/in-memory-repository/in-memory-user-repository'
import type { UserRepository } from '@/repositories/user-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import type { DailyRepository } from '@/repositories/daily-repository'
import { InMemoryDailyRepository } from '@/in-memory-repository/in-memory-daily-repository'
import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { PersonNotFoundError } from '@/errors/person-not-found'
import { GetDailyByIdUseCase } from './get-daily-by-id'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'

let userRepository: UserRepository
let dailyRepository: DailyRepository
const personRepository = new InMemoryPersonRepository()
let sut: GetDailyByIdUseCase

describe('Get daily by id', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    dailyRepository = new InMemoryDailyRepository()
    sut = new GetDailyByIdUseCase(dailyRepository, userRepository)
  })

  it('should be able to get a daily by id', async () => {
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

    await dailyRepository.create({
      id: 'daily-01',
      userPersonId: user.person_id,
      content: 'Today I worked on the project and made significant progress.',
    })

    const { daily } = await sut.execute({
      dailyId: 'daily-01',
      userId: user.person_id,
    })

    expect(daily.id).toEqual('daily-01')
  })

  it('should not be able to create a new daily with non existing user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-user-id',
        dailyId: 'daily-01',
      })
    ).rejects.toBeInstanceOf(PersonNotFoundError)
  })

  it('should not be able to create a new daily with non existing user', async () => {
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

    await expect(() =>
      sut.execute({
        userId: user.person_id,
        dailyId: 'daily-01',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
