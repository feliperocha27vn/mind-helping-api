import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryProfessionalRepository } from '../../in-memory-repository/in-memory-professional-repository'
import type { ProfessionalRepository } from '../../repositories/professional-repository'
import { FetchManyProfessionalsUseCase } from './fetch-many'

let professionalRepository: ProfessionalRepository
let sut: FetchManyProfessionalsUseCase

describe('Fetch many professionals use case', () => {
  beforeEach(() => {
    professionalRepository = new InMemoryProfessionalRepository()
    sut = new FetchManyProfessionalsUseCase(professionalRepository)
  })

  it('should be able fetch many professionals', async () => {
    const personRepository = new InMemoryPersonRepository()

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

    const person2 = await personRepository.create({
      id: 'person-02',
      name: 'Dr. João Silva Santos',
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

    await professionalRepository.create({
      person_id: person2.id,
      crp: '06/123457',
      voluntary: true,
    })

    const { professionals } = await sut.execute()

    expect(professionals).toEqual([
      expect.objectContaining({
        person_id: 'person-01',
        crp: '06/123456',
      }),
      expect.objectContaining({
        person_id: 'person-02',
        crp: '06/123457',
      }),
    ])
  })
})
