import { InMemoryCvvCallsRepository } from '@/in-memory-repository/in-memory-cvv-calls-repository'
import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { InMemoryUserRepository } from '@/in-memory-repository/in-memory-user-repository'
import type { CvvCallsRepository } from '@/repositories/cvv-calls-repository'
import type { PersonRepository } from '@/repositories/person-repository'
import type { UserRepository } from '@/repositories/user-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetCvvCallsByPersonIdUseCase } from './get-cvv-calls-by-person-id-use-case'

let userRepository: UserRepository
let personRepository: PersonRepository
let cvvCallsRepository: CvvCallsRepository
let sut: GetCvvCallsByPersonIdUseCase

describe('Get CVV calls by person ID use case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    personRepository = new InMemoryPersonRepository()
    cvvCallsRepository = new InMemoryCvvCallsRepository()
    sut = new GetCvvCallsByPersonIdUseCase(cvvCallsRepository, userRepository)
  })

  it('should be able get CVV calls by person ID', async () => {
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
      person_id: person.id,
      gender: 'Feminino',
    })

    await cvvCallsRepository.create({
      dateCalled: new Date('2024-06-20'),
      timeCalled: '50:30',
      userPersonId: user.person_id,
    })

    await cvvCallsRepository.create({
      dateCalled: new Date('2024-06-22'),
      timeCalled: '42:00',
      userPersonId: user.person_id,
    })

    const { cvvCalls } = await sut.execute({
      userPersonId: user.person_id,
    })

    expect(cvvCalls).toHaveLength(2)
    expect(cvvCalls[0].id).toEqual(expect.any(String))
    expect(cvvCalls[1].id).toEqual(expect.any(String))
  })
})
