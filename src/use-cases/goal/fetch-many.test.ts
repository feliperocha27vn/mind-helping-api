import { NotExistingGoalsRegisteredError } from '@/errors/not-existing-goals-registred'
import { PersonNotFoundError } from '@/errors/person-not-found'
import { InMemoryGoalRepository } from '@/in-memory-repository/in-memory-goal-repository'
import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchManyGoalsUseCase } from './fetch-many'

let goalRepository: InMemoryGoalRepository
let personRepository: InMemoryPersonRepository
let sut: FetchManyGoalsUseCase

describe('Fetch Many Goals', () => {
  beforeEach(() => {
    goalRepository = new InMemoryGoalRepository()
    personRepository = new InMemoryPersonRepository()
    sut = new FetchManyGoalsUseCase(goalRepository, personRepository)
  })

  it('should be able to fetch many goals', async () => {
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

    await goalRepository.create({
      userPersonId: person.id,
      description: 'New Goal',
      numberDays: 30,
    })

    await goalRepository.create({
      userPersonId: person.id,
      description: 'New Goal 2',
      numberDays: 15,
    })

    const goals = await sut.execute({
      personId: person.id,
    })

    expect(goals).toEqual({
      goals: [
        expect.objectContaining({
          userPersonId: person.id,
          description: 'New Goal',
          numberDays: 30,
        }),
        expect.objectContaining({
          userPersonId: person.id,
          description: 'New Goal 2',
          numberDays: 15,
        }),
      ],
    })
  })

  it('should not able to fetch many goals for a non-existing person', async () => {
    expect(() =>
      sut.execute({
        personId: 'non-existing-person-id',
      })
    ).rejects.toThrow(PersonNotFoundError)
  })

  it('should not able to fetch many goals if person not registered goal', async () => {
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

    expect(() =>
      sut.execute({
        personId: person.id,
      })
    ).rejects.toThrow(NotExistingGoalsRegisteredError)
  })
})
