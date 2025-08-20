import { InMemoryGoalRepository } from '@/in-memory-repository/in-memory-goal-repository'
import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { hash } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InactivateOldGoalUseCase } from './inactivitie-old-goal'

let goalRepository: InMemoryGoalRepository
let personRepository: InMemoryPersonRepository
let sut: InactivateOldGoalUseCase

describe('Inactivate old goal', () => {
  beforeEach(() => {
    goalRepository = new InMemoryGoalRepository()
    personRepository = new InMemoryPersonRepository()
    sut = new InactivateOldGoalUseCase(goalRepository, personRepository)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to inactivate an old goal', async () => {
    vi.setSystemTime(new Date(2023, 2, 1))

    const person = await personRepository.create({
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

    const createdGoal = await goalRepository.create({
      userPersonId: person.id,
      description: 'New Goal',
      numberDays: 30,
    })

    vi.setSystemTime(new Date(2023, 3, 15))

    const { goal } = await sut.execute({
      goalId: createdGoal.id,
      personId: person.id,
    })

    expect(goal).toEqual(
      expect.objectContaining({
        isExpire: true,
      })
    )
  })

  it('should not be able to inactivate a goal that is not old', async () => {
    vi.setSystemTime(new Date(2023, 3, 15))

    const person = await personRepository.create({
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

    const createdGoal = await goalRepository.create({
      userPersonId: person.id,
      description: 'New Goal',
      numberDays: 30,
    })

    vi.setSystemTime(new Date(2023, 4, 15))

    const { goal } = await sut.execute({
      goalId: createdGoal.id,
      personId: person.id,
    })

    expect(goal).toEqual(
      expect.objectContaining({
        isExpire: false,
      })
    )
  })

  it('should not be able to no inactivate goal non existent', async () => {
    await expect(() =>
      sut.execute({
        goalId: 'non-existent-goal-id',
        personId: 'non-existent-person-id',
      })
    ).rejects.toThrow('Resource not found')
  })
})
