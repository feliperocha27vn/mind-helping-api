import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { InMemoryGoalRepository } from '@/in-memory-repository/in-memory-goal-repository'
import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateGoalUseCase } from './create'

let personRepository: InMemoryPersonRepository
let goalRepository: InMemoryGoalRepository
let sut: CreateGoalUseCase

describe('Create goal use case', () => {
  beforeEach(() => {
    personRepository = new InMemoryPersonRepository()
    goalRepository = new InMemoryGoalRepository()
    sut = new CreateGoalUseCase(goalRepository, personRepository)
  })

  it('should be able to create a new goal', async () => {
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

    const { goal } = await sut.execute({
      userPersonId: person.id,
      description: 'New Goal',
      numberDays: 30,
    })

    expect(goal.id).toEqual(expect.any(String))
  })

  it('should not be able to create a goal for a non-existing person', async () => {
    await expect(() =>
      sut.execute({
        userPersonId: 'non-existing-person-id',
        description: 'New Goal',
        numberDays: 30,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
