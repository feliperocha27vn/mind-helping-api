import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { InMemoryProfessionalRepository } from '@/in-memory-repository/in-memory-professional-repository'
import type { PersonRepository } from '@/repositories/person-repository'
import type { ProfessionalRepository } from '@/repositories/professional-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetDataForUpdateProfessionalUseCase } from './get-data-for-update-professional'

let professionalRepository: ProfessionalRepository
let personRepository: PersonRepository
let sut: GetDataForUpdateProfessionalUseCase

describe('Get data for update professional', () => {
  beforeEach(() => {
    personRepository = new InMemoryPersonRepository()
    professionalRepository = new InMemoryProfessionalRepository(
      personRepository as InMemoryPersonRepository
    )
    sut = new GetDataForUpdateProfessionalUseCase(
      professionalRepository,
      personRepository
    )
  })

  it('should be able to get data for update professional', async () => {
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

    const createdProfessional = await professionalRepository.create({
      person_id: person.id,
      crp: 'CRP-123456',
      voluntary: true,
    })

    const { professional } = await sut.execute({
      professionalId: createdProfessional.person_id,
    })

    expect(professional).toEqual(
      expect.objectContaining({
        crp: createdProfessional.crp,
      })
    )
  })
})
