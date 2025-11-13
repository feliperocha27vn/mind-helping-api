import { DateNotValidError } from '@/errors/date-not-valid'
import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { InMemoryProfessionalRepository } from '@/in-memory-repository/in-memory-professional-repository'
import { InMemorySchedulingRepository } from '@/in-memory-repository/in-memory-scheduling-repository'
import type { ProfessionalRepository } from '@/repositories/professional-repository'
import type { SchedulingRepository } from '@/repositories/scheduling-repository'
import { hash } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GetSchedulingsByDateUseCase } from './get-schedulings-by-date'

let personRepository: InMemoryPersonRepository
let professionalRepository: ProfessionalRepository
let schedulingRepository: SchedulingRepository
let sut: GetSchedulingsByDateUseCase

describe('Get schedulings by date use case', () => {
  beforeEach(() => {
    vi.useFakeTimers()

    personRepository = new InMemoryPersonRepository()
    professionalRepository = new InMemoryProfessionalRepository(
      personRepository
    )
    schedulingRepository = new InMemorySchedulingRepository()
    sut = new GetSchedulingsByDateUseCase(
      schedulingRepository,
      professionalRepository
    )
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to get schedulings count by date', async () => {
    vi.setSystemTime(new Date('2024-06-10T10:00:00'))

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

    // Criar alguns agendamentos na data específica
    await schedulingRepository.create({
      hourlyId: 'hourly-01',
      professionalPersonId: professional.person_id,
      userPersonId: 'user-01',
      onFinishedConsultation: true,
    })

    await schedulingRepository.create({
      hourlyId: 'hourly-02',
      professionalPersonId: professional.person_id,
      userPersonId: 'user-02',
      onFinishedConsultation: true,
    })

    const { schedulingsCount } = await sut.execute({
      professionalId: professional.person_id,
      startDay: new Date('2024-06-10'),
      endDay: new Date('2024-06-10'),
    })

    expect(schedulingsCount).toBe(2)
  })

  it('should return null when no schedulings found in date range', async () => {
    vi.setSystemTime(new Date('2024-06-10T10:00:00'))

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

    const { schedulingsCount } = await sut.execute({
      professionalId: professional.person_id,
      startDay: new Date('2024-07-01'),
      endDay: new Date('2024-07-31'),
    })

    expect(schedulingsCount).toBeNull()
  })

  it('should not be able to get schedulings with invalid professionalId', async () => {
    await expect(() =>
      sut.execute({
        professionalId: 'invalid-professional-id',
        startDay: new Date('2024-06-10'),
        endDay: new Date('2024-06-10'),
      })
    ).rejects.toThrowError('Person not found')
  })

  it('should not be able to get schedulings with invalid start date', async () => {
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

    await expect(() =>
      sut.execute({
        professionalId: professional.person_id,
        startDay: new Date('invalid-date'),
        endDay: new Date('2024-06-10'),
      })
    ).rejects.toThrowError(DateNotValidError)
  })

  it('should not be able to get schedulings with invalid end date', async () => {
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

    await expect(() =>
      sut.execute({
        professionalId: professional.person_id,
        startDay: new Date('2024-06-10'),
        endDay: new Date('invalid-date'),
      })
    ).rejects.toThrowError(DateNotValidError)
  })

  it('should be able to get schedulings in a date range', async () => {
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

    await schedulingRepository.create({
      hourlyId: 'hourly-01',
      professionalPersonId: professional.person_id,
      userPersonId: 'user-01',
      onFinishedConsultation: true,
    })

    vi.setSystemTime(new Date('2024-06-20T14:00:00'))

    await schedulingRepository.create({
      hourlyId: 'hourly-02',
      professionalPersonId: professional.person_id,
      userPersonId: 'user-02',
      onFinishedConsultation: true,
    })

    const { schedulingsCount } = await sut.execute({
      professionalId: professional.person_id,
      startDay: new Date('2024-06-01'),
      endDay: new Date('2024-06-30'),
    })

    expect(schedulingsCount).toBe(2)
  })
})
