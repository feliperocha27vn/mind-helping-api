import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from '../../errors/resource-not-found-error'
import { InMemoryPersonRepository } from '../../in-memory-repository/in-memory-person-repository'
import { InMemoryProfessionalRepository } from '../../in-memory-repository/in-memory-professional-repository'
import type { PersonRepository } from '../../repositories/person-repository'
import type { ProfessionalRepository } from '../../repositories/professional-repository'
import { RegisterProfessionalUseCase } from './register-professional'

let professionalRepository: ProfessionalRepository
let personRepository: PersonRepository
let sut: RegisterProfessionalUseCase

describe('Register professional use case', () => {
  beforeEach(() => {
    professionalRepository = new InMemoryProfessionalRepository()
    personRepository = new InMemoryPersonRepository()
    sut = new RegisterProfessionalUseCase(
      professionalRepository,
      personRepository
    )
  })

  it('should be able regiter', async () => {
    const person = await personRepository.create({
      id: 'person-01',
      name: 'Dr. Maria Silva Santos',
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

    const { professional } = await sut.execute({
      person_id: person.id,
      crp: '06/123456',
      voluntary: true,
    })

    expect(professional.person_id).toEqual(expect.any(String))
  })

  it('should not be able de register', async () => {
    await expect(() =>
      sut.execute({
        person_id: 'no-person-exists',
        crp: '06/123456',
        voluntary: false,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
