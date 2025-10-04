import { InMemoryFeelingsRepository } from '@/in-memory-repository/in-memory-feelings-repository'
import { InMemoryGoalRepository } from '@/in-memory-repository/in-memory-goal-repository'
import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { InMemoryUserRepository } from '@/in-memory-repository/in-memory-user-repository'
import type { FeelingsRepository } from '@/repositories/feelings-repository'
import type { GoalRepository } from '@/repositories/goal-repository'
import type { PersonRepository } from '@/repositories/person-repository'
import type { UserRepository } from '@/repositories/user-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetMeUserUseCase } from './get-me-user'

let userRepository: UserRepository
let personRepository: PersonRepository
let feelingsRepository: FeelingsRepository
let goalRepository: GoalRepository
let sut: GetMeUserUseCase

describe('Get me user use case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    personRepository = new InMemoryPersonRepository()
    feelingsRepository = new InMemoryFeelingsRepository()
    goalRepository = new InMemoryGoalRepository()
    sut = new GetMeUserUseCase(
      personRepository,
      feelingsRepository,
      goalRepository
    )
  })

  it('should be able to create a feeling user', async () => {
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

    const { profile } = await sut.execute({ userId: user.person_id })

    expect(profile.nameUser).toEqual('Maria Silva Santos')
    expect(profile.countExecutedGoals).toEqual(0)
  })
})
