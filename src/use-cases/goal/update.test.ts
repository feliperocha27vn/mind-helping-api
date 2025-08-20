import { GoalCanOnlyBeExecutedOnceError } from '@/errors/goal-can-only-be-executed-once'
import { InMemoryGoalRepository } from '@/in-memory-repository/in-memory-goal-repository'
import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { UpdateGoalUseCase } from './update'

let goalRepository: InMemoryGoalRepository
let personRepository: InMemoryPersonRepository
let sut: UpdateGoalUseCase

describe('Update Goal', () => {
  beforeEach(() => {
    goalRepository = new InMemoryGoalRepository()
    personRepository = new InMemoryPersonRepository()
    sut = new UpdateGoalUseCase(goalRepository, personRepository)
  })

  it('should be able to update goal', async () => {
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

    const { goal } = await sut.execute({
      goalId: createdGoal.id,
      userPersonId: person.id,
      description: 'Updated Goal',
      numberDays: 15,
    })

    expect(goal).toEqual(
      expect.objectContaining({
        description: 'Updated Goal',
      })
    )
  })

  it('should not be able update goal executed', async () => {
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

    await goalRepository.updateExecuteGoal(createdGoal.id, person.id)

    expect(() =>
      sut.execute({
        goalId: createdGoal.id,
        userPersonId: person.id,
        description: 'Updated Goal',
        numberDays: 15,
      })
    ).rejects.toThrowError(GoalCanOnlyBeExecutedOnceError)
  })
})
