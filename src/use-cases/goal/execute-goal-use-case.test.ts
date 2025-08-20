import { InMemoryGoalRepository } from '@/in-memory-repository/in-memory-goal-repository'
import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { ExecuteGoalUseCase } from './execute-goal-use-case'

let goalRepository: InMemoryGoalRepository
let personRepository: InMemoryPersonRepository
let sut: ExecuteGoalUseCase

describe('Execute old goal', () => {
  beforeEach(() => {
    goalRepository = new InMemoryGoalRepository()
    personRepository = new InMemoryPersonRepository()
    sut = new ExecuteGoalUseCase(goalRepository, personRepository)
  })

  it('should be able to execute an old goal', async () => {
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
      personId: person.id,
    })

    expect(goal).toEqual(
      expect.objectContaining({
        isExecuted: true,
      })
    )
  })

  it('should not be able to update a target that does not exist', async () => {
    expect(
      async () =>
        await sut.execute({
          goalId: 'non-existing-goal-id',
          personId: 'non-existing-person-id',
        })
    )
  })
})
