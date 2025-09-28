import { InMemoryHourlyRepository } from '@/in-memory-repository/in-memory-hourly-repository'
import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { InMemoryProfessionalRepository } from '@/in-memory-repository/in-memory-professional-repository'
import { InMemoryScheduleRepository } from '@/in-memory-repository/in-memory-schedule-repository'
import { InMemorySchedulingRepository } from '@/in-memory-repository/in-memory-scheduling-repository'
import { InMemoryUserRepository } from '@/in-memory-repository/in-memory-user-repository'
import { hash } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CreateSchedulingUseCase } from './create'

let userRepository: InMemoryUserRepository
let professionalRepository: InMemoryProfessionalRepository
let hourlyRepository: InMemoryHourlyRepository
let personRepository: InMemoryPersonRepository
let schedulingRepository: InMemorySchedulingRepository
let scheduleRepository: InMemoryScheduleRepository
let sut: CreateSchedulingUseCase

describe('Create scheduling use case', () => {
  beforeEach(() => {
    personRepository = new InMemoryPersonRepository()
    userRepository = new InMemoryUserRepository()
    professionalRepository = new InMemoryProfessionalRepository(
      personRepository
    )
    hourlyRepository = new InMemoryHourlyRepository()
    schedulingRepository = new InMemorySchedulingRepository()
    scheduleRepository = new InMemoryScheduleRepository()
    sut = new CreateSchedulingUseCase(
      scheduleRepository,
      schedulingRepository,
      hourlyRepository,
      professionalRepository,
      userRepository
    )

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to create a scheduling', async () => {
    vi.setSystemTime(new Date('2024-12-01T10:00:00'))

    const professionalPerson = await personRepository.create({
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

    const professional = await professionalRepository.create({
      person_id: professionalPerson.id,
      crp: '123456789',
      voluntary: false,
    })

    const userPerson = await personRepository.create({
      id: 'person-02',
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
      person_id: userPerson.id,
    })

    const schedule = await scheduleRepository.create({
      professionalPersonId: professional.person_id,
      averageValue: 150,
      cancellationPolicy: 24,
      initialTime: new Date('2024-12-31T09:00:00'),
      endTime: new Date('2024-12-31T18:00:00'),
      interval: 60,
      isControlled: true,
      observation: 'Atendimento presencial',
    })

    await hourlyRepository.createHourlySlots(
      schedule.id,
      schedule.initialTime,
      schedule.endTime,
      schedule.interval
    )

    const { scheduling } = await sut.execute({
      professionalPersonId: professional.person_id,
      userPersonId: user.person_id,
      scheduleId: schedule.id,
      date: new Date('2024-12-31T10:00:00'),
      hour: '10:00',
    })

    expect(scheduling.id).toEqual(expect.any(String))
  })
})
