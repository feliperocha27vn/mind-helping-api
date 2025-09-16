import { InMemoryGoalRepository } from '@/in-memory-repository/in-memory-goal-repository'
import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { AddCounterUseCase } from './add-counter'

let personRepository: InMemoryPersonRepository
let goalRepository: InMemoryGoalRepository
let sut: AddCounterUseCase

describe('Create goal use case', () => {
  beforeEach(() => {
    personRepository = new InMemoryPersonRepository()
    goalRepository = new InMemoryGoalRepository()
    sut = new AddCounterUseCase(goalRepository, personRepository)
  })

  it('should be able to add a counter to a goal', async () => {
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
      description: 'New Goal',
      numberDays: 30,
      userPersonId: person.id,
    })

    const { goal } = await sut.execute({
      goalId: createdGoal.id,
      personId: person.id,
    })

    expect(goal.counter).toEqual(1)
  })
})
