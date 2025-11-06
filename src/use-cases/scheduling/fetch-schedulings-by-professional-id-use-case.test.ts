import { InMemoryHourlyRepository } from '@/in-memory-repository/in-memory-hourly-repository'
import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { InMemoryProfessionalRepository } from '@/in-memory-repository/in-memory-professional-repository'
import { InMemoryScheduleRepository } from '@/in-memory-repository/in-memory-schedule-repository'
import { InMemorySchedulingRepository } from '@/in-memory-repository/in-memory-scheduling-repository'
import { InMemoryUserRepository } from '@/in-memory-repository/in-memory-user-repository'
import { hash } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FetchSchedulingsByProfessionalIdUseCase } from './fetch-schedulings-by-professional-id-use-case'

let userRepository: InMemoryUserRepository
let professionalRepository: InMemoryProfessionalRepository
let hourlyRepository: InMemoryHourlyRepository
let personRepository: InMemoryPersonRepository
let schedulingRepository: InMemorySchedulingRepository
let scheduleRepository: InMemoryScheduleRepository
let sut: FetchSchedulingsByProfessionalIdUseCase

describe('Fetch schedulings by professional id use case', () => {
  beforeEach(() => {
    personRepository = new InMemoryPersonRepository()
    professionalRepository = new InMemoryProfessionalRepository(
      personRepository
    )
    userRepository = new InMemoryUserRepository()
    hourlyRepository = new InMemoryHourlyRepository()
    schedulingRepository = new InMemorySchedulingRepository()
    scheduleRepository = new InMemoryScheduleRepository()
    sut = new FetchSchedulingsByProfessionalIdUseCase(
      schedulingRepository,
      personRepository,
      userRepository,
      hourlyRepository
    )

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to fetch schedulings by professional id', async () => {
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
      name: 'Pessoa 2',
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

    const userPerson2 = await personRepository.create({
      id: 'person-03',
      name: 'Pessoa 3',
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

    const user2 = await userRepository.create({
      gender: 'male',
      person_id: userPerson2.id,
    })

    const schedule = await scheduleRepository.create({
      professionalPersonId: professional.person_id,
      averageValue: 150,
      cancellationPolicy: 24,
      initialTime: new Date('2024-12-31T09:00:00.000Z'),
      endTime: new Date('2024-12-31T18:00:00.000Z'),
      interval: 60,
      isControlled: true,
      observation: 'Atendimento presencial',
    })

    const hourlySlots = await hourlyRepository.createHourlySlots(
      schedule.id,
      schedule.initialTime,
      schedule.endTime,
      schedule.interval
    )

    await schedulingRepository.create({
      professionalPersonId: professional.person_id,
      userPersonId: user.person_id,
      hourlyId: hourlySlots[0].id,
    })

    await schedulingRepository.create({
      professionalPersonId: professional.person_id,
      userPersonId: user2.person_id,
      hourlyId: hourlySlots[5].id,
    })

    vi.setSystemTime(new Date('2024-12-06T10:00:00'))

    await schedulingRepository.create({
      professionalPersonId: professional.person_id,
      userPersonId: user2.person_id,
      hourlyId: hourlySlots[2].id,
    })

    const { schedulings } = await sut.execute({
      professionalId: professional.person_id,
      startDay: new Date('2024-12-01T00:00:00.000Z'),
      endDay: new Date('2024-12-31T23:59:59.999Z'),
    })

    expect(schedulings).toHaveLength(3)
    expect(schedulings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          schedulingId: expect.any(String),
        }),
      ])
    )
  })
})
