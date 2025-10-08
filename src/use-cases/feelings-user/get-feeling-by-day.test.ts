import { DateNotValidError } from '@/errors/date-not-valid'
import { InMemoryFeelingsRepository } from '@/in-memory-repository/in-memory-feelings-repository'
import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { InMemoryUserRepository } from '@/in-memory-repository/in-memory-user-repository'
import type { FeelingsRepository } from '@/repositories/feelings-repository'
import type { PersonRepository } from '@/repositories/person-repository'
import type { UserRepository } from '@/repositories/user-repository'
import { hash } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GetFeelingByDayUseCase } from './get-feeling-by-day'

let userRepository: UserRepository
let personRepository: PersonRepository
let feelingsRepository: FeelingsRepository
let sut: GetFeelingByDayUseCase

describe('Get feeling by day use case', () => {
  beforeEach(() => {
    vi.useFakeTimers()

    userRepository = new InMemoryUserRepository()
    personRepository = new InMemoryPersonRepository()
    feelingsRepository = new InMemoryFeelingsRepository()
    sut = new GetFeelingByDayUseCase(
      personRepository,
      userRepository,
      feelingsRepository
    )
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able get a feelings by day user', async () => {
    vi.setSystemTime(new Date('2024-06-10T10:00:00'))

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
      gender: 'female',
      person_id: person.id,
    })

    await feelingsRepository.create({
      description: 'ANSIOSO',
      motive: 'Amanhã tenho uma entrevista de emprego!',
      userPersonId: user.person_id,
    })

    await feelingsRepository.create({
      description: 'FELIZ',
      motive: 'Consegui um novo emprego!',
      userPersonId: user.person_id,
    })

    const { feelings } = await sut.execute({
      userId: user.person_id,
      day: new Date('2024-06-10'),
    })

    expect(feelings).toHaveLength(2)
  })

  it('should not be able get a feelings by day with invalid userId', async () => {
    await expect(() =>
      sut.execute({
        userId: 'invalid-user-id',
        day: new Date('2024-06-10'),
      })
    ).rejects.toThrowError('Person not found')
  })

  it('should not be able get a feelings by day with invalid date', async () => {
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
    await userRepository.create({
      gender: 'female',
      person_id: person.id,
    })
    await expect(() =>
      sut.execute({
        userId: person.id,
        day: new Date('invalid-date'),
      })
    ).rejects.toThrowError(DateNotValidError)
  })
})
