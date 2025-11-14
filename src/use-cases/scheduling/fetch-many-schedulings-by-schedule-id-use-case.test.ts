import { hash } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryHourlyRepository } from '@/in-memory-repository/in-memory-hourly-repository'
import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { InMemoryProfessionalRepository } from '@/in-memory-repository/in-memory-professional-repository'
import { InMemoryScheduleRepository } from '@/in-memory-repository/in-memory-schedule-repository'
import { InMemorySchedulingRepository } from '@/in-memory-repository/in-memory-scheduling-repository'
import { InMemoryUserRepository } from '@/in-memory-repository/in-memory-user-repository'
import { FetchManySchedulingsByScheduleIdUseCase } from './fetch-many-schedulings-by-schedule-id-use-case'

let userRepository: InMemoryUserRepository
let professionalRepository: InMemoryProfessionalRepository
let hourlyRepository: InMemoryHourlyRepository
let personRepository: InMemoryPersonRepository
let schedulingRepository: InMemorySchedulingRepository
let scheduleRepository: InMemoryScheduleRepository
let sut: FetchManySchedulingsByScheduleIdUseCase

describe('Fetch many schedulings by schedule id use case', () => {
  beforeEach(() => {
    personRepository = new InMemoryPersonRepository()
    professionalRepository = new InMemoryProfessionalRepository(
      personRepository
    )
    userRepository = new InMemoryUserRepository()
    hourlyRepository = new InMemoryHourlyRepository()
    schedulingRepository = new InMemorySchedulingRepository()
    scheduleRepository = new InMemoryScheduleRepository()
    sut = new FetchManySchedulingsByScheduleIdUseCase(
      schedulingRepository,
      personRepository,
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
      scheduleId: schedule.id,
      startDay: new Date('2024-12-01T00:00:00.000Z'),
      endDay: new Date('2024-12-31T23:59:59.999Z'),
      page: 1,
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

  it('should fetch schedulings filtered by date range (day 20 to 27)', async () => {
    vi.setSystemTime(new Date('2024-12-01T10:00:00'))

    const professionalPerson = await personRepository.create({
      id: 'person-prof-01',
      name: 'Dr. João Silva',
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
      email: 'joao.silva@email.com',
      password_hash: await hash('senha123', 6),
    })

    const professional = await professionalRepository.create({
      person_id: professionalPerson.id,
      crp: '987654321',
      voluntary: false,
    })

    // Criar 3 usuários
    const userPerson1 = await personRepository.create({
      id: 'person-user-01',
      name: 'Paciente 1',
      birth_date: '1990-05-20',
      cpf: '111.111.111-11',
      address: 'Rua A',
      neighborhood: 'Bairro A',
      number: 100,
      complement: 'Apto 1',
      cep: '01000-000',
      city: 'São Paulo',
      uf: 'SP',
      phone: '(11) 91111-1111',
      email: 'paciente1@email.com',
      password_hash: await hash('senha123', 6),
    })

    const user1 = await userRepository.create({
      gender: 'female',
      person_id: userPerson1.id,
    })

    const userPerson2 = await personRepository.create({
      id: 'person-user-02',
      name: 'Paciente 2',
      birth_date: '1992-07-15',
      cpf: '222.222.222-22',
      address: 'Rua B',
      neighborhood: 'Bairro B',
      number: 200,
      complement: 'Apto 2',
      cep: '02000-000',
      city: 'São Paulo',
      uf: 'SP',
      phone: '(11) 92222-2222',
      email: 'paciente2@email.com',
      password_hash: await hash('senha123', 6),
    })

    const user2 = await userRepository.create({
      gender: 'male',
      person_id: userPerson2.id,
    })

    const userPerson3 = await personRepository.create({
      id: 'person-user-03',
      name: 'Paciente 3',
      birth_date: '1988-09-10',
      cpf: '333.333.333-33',
      address: 'Rua C',
      neighborhood: 'Bairro C',
      number: 300,
      complement: 'Apto 3',
      cep: '03000-000',
      city: 'São Paulo',
      uf: 'SP',
      phone: '(11) 93333-3333',
      email: 'paciente3@email.com',
      password_hash: await hash('senha123', 6),
    })

    const user3 = await userRepository.create({
      gender: 'female',
      person_id: userPerson3.id,
    })

    // Criar schedule para dia 20
    const schedule20 = await scheduleRepository.create({
      professionalPersonId: professional.person_id,
      averageValue: 150,
      cancellationPolicy: 24,
      initialTime: new Date('2024-12-20T09:00:00.000Z'),
      endTime: new Date('2024-12-20T17:00:00.000Z'),
      interval: 60,
      isControlled: true,
      observation: 'Atendimento dia 20',
    })

    const hourlySlots20 = await hourlyRepository.createHourlySlots(
      schedule20.id,
      schedule20.initialTime,
      schedule20.endTime,
      schedule20.interval
    )

    // Criar schedule para dia 24 (meio do intervalo)
    const schedule24 = await scheduleRepository.create({
      professionalPersonId: professional.person_id,
      averageValue: 150,
      cancellationPolicy: 24,
      initialTime: new Date('2024-12-24T09:00:00.000Z'),
      endTime: new Date('2024-12-24T17:00:00.000Z'),
      interval: 60,
      isControlled: true,
      observation: 'Atendimento dia 24',
    })

    const hourlySlots24 = await hourlyRepository.createHourlySlots(
      schedule24.id,
      schedule24.initialTime,
      schedule24.endTime,
      schedule24.interval
    )

    // Criar schedule para dia 27
    const schedule27 = await scheduleRepository.create({
      professionalPersonId: professional.person_id,
      averageValue: 150,
      cancellationPolicy: 24,
      initialTime: new Date('2024-12-27T09:00:00.000Z'),
      endTime: new Date('2024-12-27T17:00:00.000Z'),
      interval: 60,
      isControlled: true,
      observation: 'Atendimento dia 27',
    })

    const hourlySlots27 = await hourlyRepository.createHourlySlots(
      schedule27.id,
      schedule27.initialTime,
      schedule27.endTime,
      schedule27.interval
    )

    // Criar agendamentos no dia 20
    await schedulingRepository.create({
      professionalPersonId: professional.person_id,
      userPersonId: user1.person_id,
      hourlyId: hourlySlots20[0].id, // 09:00
    })

    // Criar agendamentos no dia 24 (meio do intervalo)
    await schedulingRepository.create({
      professionalPersonId: professional.person_id,
      userPersonId: user2.person_id,
      hourlyId: hourlySlots24[3].id, // 12:00
    })

    await schedulingRepository.create({
      professionalPersonId: professional.person_id,
      userPersonId: user3.person_id,
      hourlyId: hourlySlots24[5].id, // 14:00
    })

    // Criar agendamento no dia 27
    await schedulingRepository.create({
      professionalPersonId: professional.person_id,
      userPersonId: user1.person_id,
      hourlyId: hourlySlots27[2].id, // 11:00
    })

    // Buscar agendamentos entre dias 20 e 27
    const { schedulings } = await sut.execute({
      scheduleId: schedule20.id, // Usar o primeiro schedule como referência
      startDay: new Date('2024-12-20T00:00:00.000Z'),
      endDay: new Date('2024-12-27T23:59:59.999Z'),
      page: 1,
    })

    // Deve retornar apenas o agendamento do dia 20 (que está naquele schedule específico)
    expect(schedulings).toHaveLength(1)
    expect(schedulings[0]).toMatchObject({
      schedulingId: expect.any(String),
      namePacient: 'Paciente 1',
      hour: '09:00',
      pacientId: user1.person_id,
    })
  })

  it('should fetch all schedulings from multiple schedules within date range', async () => {
    vi.setSystemTime(new Date('2024-12-01T10:00:00'))

    const professionalPerson = await personRepository.create({
      id: 'person-prof-02',
      name: 'Dr. Ana Costa',
      birth_date: '1985-03-15',
      cpf: '456.789.012-34',
      address: 'Rua das Flores',
      neighborhood: 'Centro',
      number: 1232,
      complement: 'Sala 202',
      cep: '01234-567',
      city: 'São Paulo',
      uf: 'SP',
      phone: '(11) 99999-9999',
      email: 'ana.costa@email.com',
      password_hash: await hash('senha123', 6),
    })

    const professional = await professionalRepository.create({
      person_id: professionalPerson.id,
      crp: '555666777',
      voluntary: false,
    })

    const userPerson = await personRepository.create({
      id: 'person-user-04',
      name: 'Paciente 4',
      birth_date: '1995-01-01',
      cpf: '444.444.444-44',
      address: 'Rua D',
      neighborhood: 'Bairro D',
      number: 400,
      complement: 'Apto 4',
      cep: '04000-000',
      city: 'São Paulo',
      uf: 'SP',
      phone: '(11) 94444-4444',
      email: 'paciente4@email.com',
      password_hash: await hash('senha123', 6),
    })

    const user = await userRepository.create({
      gender: 'male',
      person_id: userPerson.id,
    })

    // Schedule para dia 20
    const schedule20 = await scheduleRepository.create({
      professionalPersonId: professional.person_id,
      averageValue: 200,
      cancellationPolicy: 48,
      initialTime: new Date('2024-12-20T10:00:00.000Z'),
      endTime: new Date('2024-12-20T16:00:00.000Z'),
      interval: 60,
      isControlled: true,
      observation: 'Turno manhã',
    })

    const hourlySlots20 = await hourlyRepository.createHourlySlots(
      schedule20.id,
      schedule20.initialTime,
      schedule20.endTime,
      schedule20.interval
    )

    // Schedule para dia 24
    const schedule24 = await scheduleRepository.create({
      professionalPersonId: professional.person_id,
      averageValue: 200,
      cancellationPolicy: 48,
      initialTime: new Date('2024-12-24T14:00:00.000Z'),
      endTime: new Date('2024-12-24T18:00:00.000Z'),
      interval: 60,
      isControlled: true,
      observation: 'Turno tarde',
    })

    const hourlySlots24 = await hourlyRepository.createHourlySlots(
      schedule24.id,
      schedule24.initialTime,
      schedule24.endTime,
      schedule24.interval
    )

    // Agendamentos
    await schedulingRepository.create({
      professionalPersonId: professional.person_id,
      userPersonId: user.person_id,
      hourlyId: hourlySlots20[1].id, // 11:00 no dia 20
    })

    await schedulingRepository.create({
      professionalPersonId: professional.person_id,
      userPersonId: user.person_id,
      hourlyId: hourlySlots24[0].id, // 14:00 no dia 24
    })

    // Buscar agendamentos do schedule 20 entre 20-27
    const { schedulings: schedulings20 } = await sut.execute({
      scheduleId: schedule20.id,
      startDay: new Date('2024-12-20T00:00:00.000Z'),
      endDay: new Date('2024-12-27T23:59:59.999Z'),
      page: 1,
    })

    // Buscar agendamentos do schedule 24 entre 20-27
    const { schedulings: schedulings24 } = await sut.execute({
      scheduleId: schedule24.id,
      startDay: new Date('2024-12-20T00:00:00.000Z'),
      endDay: new Date('2024-12-27T23:59:59.999Z'),
      page: 1,
    })

    expect(schedulings20).toHaveLength(1)
    expect(schedulings20[0]).toMatchObject({
      hour: '11:00',
      namePacient: 'Paciente 4',
    })

    expect(schedulings24).toHaveLength(1)
    expect(schedulings24[0]).toMatchObject({
      hour: '14:00',
      namePacient: 'Paciente 4',
    })
  })
})
