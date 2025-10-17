import { InMemoryUserRepository } from '@/in-memory-repository/in-memory-user-repository'
import type { UserRepository } from '@/repositories/user-repository'
import { hash } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { DailyRepository } from '@/repositories/daily-repository'
import { InMemoryDailyRepository } from '@/in-memory-repository/in-memory-daily-repository'
import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { PersonNotFoundError } from '@/errors/person-not-found'
import { FetchDailysByDateRangeAndUserIdUseCase } from './fetch-dailys-by-date-range-and-user-id'

let userRepository: UserRepository
let dailyRepository: DailyRepository
const personRepository = new InMemoryPersonRepository()
let sut: FetchDailysByDateRangeAndUserIdUseCase

describe('Fetch dailys', () => {
  beforeEach(() => {
    vi.useFakeTimers()

    userRepository = new InMemoryUserRepository()
    dailyRepository = new InMemoryDailyRepository()
    sut = new FetchDailysByDateRangeAndUserIdUseCase(
      dailyRepository,
      userRepository
    )
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to fetch a dailys by user', async () => {
    vi.setSystemTime(new Date('2023-10-01'))

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
      content: 'Today I worked on the project and made significant progress.',
      userPersonId: user.person_id,
    })

    vi.setSystemTime(new Date('2023-11-15'))

    await dailyRepository.create({
      content: 'Today I had a meeting with the team to discuss the next steps.',
      userPersonId: user.person_id,
    })

    const { dailys } = await sut.execute({
      userId: user.person_id,
      startDay: new Date('2023-01-01'),
      endDay: new Date('2024-12-31'),
    })

    expect(dailys).toHaveLength(2)
    expect(dailys).toEqual([
      expect.objectContaining({
        content: 'Today I worked on the project and made significant progress.',
      }),
      expect.objectContaining({
        content:
          'Today I had a meeting with the team to discuss the next steps.',
      }),
    ])
  })

  it('should not be able to create a new daily with non existing user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-user-id',
        startDay: new Date('2023-01-01'),
        endDay: new Date('2024-12-31'),
      })
    ).rejects.toBeInstanceOf(PersonNotFoundError)
  })

  it('should be able to fetch a dailys by user, in unique date', async () => {
    vi.setSystemTime(new Date('2023-10-01'))

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
      content: 'Today I worked on the project and made significant progress.',
      userPersonId: user.person_id,
    })

    await dailyRepository.create({
      content: 'Today I had a meeting with the team to discuss the next steps.',
      userPersonId: user.person_id,
    })

    const { dailys } = await sut.execute({
      userId: user.person_id,
      startDay: new Date('2023-01-01'),
      endDay: new Date('2024-01-01'),
    })

    expect(dailys).toHaveLength(2)
    expect(dailys).toEqual([
      expect.objectContaining({
        content: 'Today I worked on the project and made significant progress.',
      }),
      expect.objectContaining({
        content:
          'Today I had a meeting with the team to discuss the next steps.',
      }),
    ])
  })
})
