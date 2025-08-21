import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { InMemoryGoalRepository } from '@/in-memory-repository/in-memory-goal-repository'
import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { DeleteGoalUseCase } from './delete'

let goalRepository: InMemoryGoalRepository
let personRepository: InMemoryPersonRepository
let sut: DeleteGoalUseCase

describe('Delete Goal', () => {
  beforeEach(() => {
    goalRepository = new InMemoryGoalRepository()
    personRepository = new InMemoryPersonRepository()
    sut = new DeleteGoalUseCase(goalRepository, personRepository)
  })

  it('should be able to delete goal', async () => {
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

    await sut.execute({
      goalId: createdGoal.id,
      personId: person.id,
    })

    const goal = await goalRepository.findById(createdGoal.id)

    expect(goal).toBeNull()
  })

  it('should be not able to delete goal', async () => {
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

    expect(
      async () =>
        await sut.execute({
          goalId: 'no-exists-goal',
          personId: person.id,
        })
    ).rejects.toThrow(ResourceNotFoundError)
  })
})
