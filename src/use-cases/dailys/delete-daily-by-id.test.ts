import { InMemoryUserRepository } from '@/in-memory-repository/in-memory-user-repository'
import type { UserRepository } from '@/repositories/user-repository'
import { hash } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { DailyRepository } from '@/repositories/daily-repository'
import { InMemoryDailyRepository } from '@/in-memory-repository/in-memory-daily-repository'
import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { PersonNotFoundError } from '@/errors/person-not-found'
import { DeleteDailyByIdUseCase } from './delete-daily-by-id'

let userRepository: UserRepository
let dailyRepository: DailyRepository
const personRepository = new InMemoryPersonRepository()
let sut: DeleteDailyByIdUseCase

describe('Delete daily by id', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    userRepository = new InMemoryUserRepository()
    dailyRepository = new InMemoryDailyRepository()
    sut = new DeleteDailyByIdUseCase(dailyRepository, userRepository)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to delete a daily', async () => {
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

    const daily = await dailyRepository.create({
      content: 'Today I worked on the project and made significant progress.',
      userPersonId: user.person_id,
    })

    await sut.execute({
      dailyId: daily.id,
      userId: user.person_id,
    })

    const dailys = await dailyRepository.fetchDailysByDateRangeAndUserId(
      user.person_id,
      new Date('2023-01-01'),
      new Date('2023-12-31')
    )

    expect(dailys).toHaveLength(0)
  })

  it('should not be able to delete a new daily with non existing user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-user-id',
        dailyId: 'non-existing-daily-id',
      })
    ).rejects.toBeInstanceOf(PersonNotFoundError)
  })
})
