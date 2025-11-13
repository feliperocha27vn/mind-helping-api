import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { InMemoryProfessionalRepository } from '@/in-memory-repository/in-memory-professional-repository'
import { InMemorySchedulingRepository } from '@/in-memory-repository/in-memory-scheduling-repository'
import type { ProfessionalRepository } from '@/repositories/professional-repository'
import type { SchedulingRepository } from '@/repositories/scheduling-repository'
import { hash } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GetAttendanceRateUseCase } from './get-attendance-rate'
import { PersonNotFoundError } from '@/errors/person-not-found'
import { DateNotValidError } from '@/errors/date-not-valid'

let personRepository: InMemoryPersonRepository
let professionalRepository: ProfessionalRepository
let schedulingRepository: SchedulingRepository
let sut: GetAttendanceRateUseCase

describe('Get attendance schedulings rate use case', () => {
  beforeEach(() => {
    vi.useFakeTimers()

    personRepository = new InMemoryPersonRepository()
    professionalRepository = new InMemoryProfessionalRepository(
      personRepository
    )
    schedulingRepository = new InMemorySchedulingRepository()
    sut = new GetAttendanceRateUseCase(
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

    await schedulingRepository.create({
      hourlyId: 'hourly-01',
      professionalPersonId: professional.person_id,
      userPersonId: 'user-01',
      isCanceled: true,
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

    vi.setSystemTime(new Date('2024-06-25T14:00:00'))

    await schedulingRepository.create({
      hourlyId: 'hourly-02',
      professionalPersonId: professional.person_id,
      userPersonId: 'user-02',
      onFinishedConsultation: true,
    })

    const { attendanceRate } = await sut.execute({
      professionalId: professional.person_id,
      startDay: new Date('2024-06-01'),
      endDay: new Date('2024-06-30'),
    })

    expect(attendanceRate).toEqual(75)
  })

  it('should not be able to get schedulings by date if professional does not exist', async () => {
    await expect(() =>
      sut.execute({
        professionalId: 'non-existing-professional-id',
        startDay: new Date('2024-06-10'),
        endDay: new Date('2024-06-20'),
      })
    ).rejects.toThrowError(PersonNotFoundError)
  })

  it('should not be able to get schedulings by date if start date is invalid', async () => {
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

    expect(() =>
      sut.execute({
        professionalId: professional.person_id,
        startDay: new Date('invalid-date'),
        endDay: new Date('2024-06-20'),
      })
    ).rejects.toThrowError(DateNotValidError)
  })
})
