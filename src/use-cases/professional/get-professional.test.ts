import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryProfessionalRepository } from '../../in-memory-repository/in-memory-professional-repository'
import type { ProfessionalRepository } from '../../repositories/professional-repository'
import { GetProfessionalByIdUseCase } from './get-professional'

let personRepository: InMemoryPersonRepository
let professionalRepository: ProfessionalRepository
let sut: GetProfessionalByIdUseCase

describe('Get professional by ID use case', () => {
  beforeEach(() => {
    personRepository = new InMemoryPersonRepository()
    professionalRepository = new InMemoryProfessionalRepository(
      personRepository
    )
    sut = new GetProfessionalByIdUseCase(professionalRepository)
  })

  it('should be able fetch many professionals', async () => {
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

    await professionalRepository.create({
      person_id: person.id,
      crp: '06/123456',
      voluntary: true,
    })

    const { professional } = await sut.execute({ professionalId: person.id })

    expect(professional).toEqual(
      expect.objectContaining({
        id: person.id,
        name: person.name,
        email: person.email,
        phone: person.phone,
        address: person.address,
        neighborhood: person.neighborhood,
        city: person.city,
        uf: person.uf,
      })
    )
  })
})
