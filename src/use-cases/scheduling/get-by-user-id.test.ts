import { InMemoryHourlyRepository } from '@/in-memory-repository/in-memory-hourly-repository'
import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { InMemoryProfessionalRepository } from '@/in-memory-repository/in-memory-professional-repository'
import { InMemoryScheduleRepository } from '@/in-memory-repository/in-memory-schedule-repository'
import { InMemorySchedulingRepository } from '@/in-memory-repository/in-memory-scheduling-repository'
import { InMemoryUserRepository } from '@/in-memory-repository/in-memory-user-repository'
import { hash } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GetSchedulingUseCase } from './get-by-user-id'

let hourlyRepository: InMemoryHourlyRepository
let personRepository: InMemoryPersonRepository
let schedulingRepository: InMemorySchedulingRepository
let sut: GetSchedulingUseCase

describe('Get scheduling use case', () => {
  beforeEach(() => {
    personRepository = new InMemoryPersonRepository()
    hourlyRepository = new InMemoryHourlyRepository()
    schedulingRepository = new InMemorySchedulingRepository()
    sut = new GetSchedulingUseCase(
      schedulingRepository,
      personRepository,
      hourlyRepository
    )
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to get a scheduling', async () => {
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

    const professionalRepository = new InMemoryProfessionalRepository(
      personRepository
    )

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

    const userRepository = new InMemoryUserRepository()

    const user = await userRepository.create({
      gender: 'female',
      person_id: userPerson.id,
    })

    const scheduleRepository = new InMemoryScheduleRepository()

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
      hourlyId: hourlySlots[1].id,
    })

    const { schedulingDetails } = await sut.execute({
      userId: user.person_id,
    })

    expect(schedulingDetails.nameProfessional).toEqual('Dr. Maria Silva Santos')
    expect(schedulingDetails.hour).toEqual('10:00')
  })
})
