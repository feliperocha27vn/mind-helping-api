import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { InMemoryProfessionalRepository } from '@/in-memory-repository/in-memory-professional-repository'
import { InMemorySchedulingRepository } from '@/in-memory-repository/in-memory-scheduling-repository'
import type { ProfessionalRepository } from '@/repositories/professional-repository'
import type { SchedulingRepository } from '@/repositories/scheduling-repository'
import { hash } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GetSchedulingsCancelByProfessionalId } from './get-schedulings-cancel-by-professional-id'

let personRepository: InMemoryPersonRepository
let professionalRepository: ProfessionalRepository
let schedulingRepository: SchedulingRepository
let sut: GetSchedulingsCancelByProfessionalId

describe('Get schedulings cancel by professional id use case', () => {
  beforeEach(() => {
    vi.useFakeTimers()

    personRepository = new InMemoryPersonRepository()
    professionalRepository = new InMemoryProfessionalRepository(
      personRepository
    )
    schedulingRepository = new InMemorySchedulingRepository()
    sut = new GetSchedulingsCancelByProfessionalId(
      schedulingRepository,
      professionalRepository
    )
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to get schedulings cancel by professional id', async () => {
    vi.setSystemTime(new Date('2024-06-15T10:00:00'))

    const person = await personRepository.create({
      id: 'person-01',
      name: 'Dr. João Silva',
      birth_date: '1980-05-20',
      cpf: '987.654.321-00',
      address: 'Av. Principal',
      neighborhood: 'Centro',
      number: 500,
      complement: 'Consultório 301',
      cep: '12345-678',
      city: 'São Paulo',
      uf: 'SP',
      phone: '(11) 98888-7777',
      email: 'dr.joao@email.com',
      password_hash: await hash('senha123', 6),
    })

    const professional = await professionalRepository.create({
      person_id: person.id,
      crp: '06/123456',
      voluntary: false,
    })

    // Criar agendamentos em datas diferentes dentro do range
    await schedulingRepository.create({
      hourlyId: 'hourly-01',
      professionalPersonId: professional.person_id,
      userPersonId: 'user-01',
      isCanceled: true,
    })

    const { schedulingsCancel } = await sut.execute({
      professionalId: professional.person_id,
    })

    expect(schedulingsCancel).toBe(1)
  })
})
