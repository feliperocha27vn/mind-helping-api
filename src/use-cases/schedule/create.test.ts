import { DateNotValidError } from '@/errors/date-not-valid'
import { InMemoryHourlyRepository } from '@/in-memory-repository/in-memory-hourly-repository'
import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { InMemoryScheduleRepository } from '@/in-memory-repository/in-memory-schedule-repository'
import { hash } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CreateScheduleUseCase } from './create'

let personRepository: InMemoryPersonRepository
let hourlyRepository: InMemoryHourlyRepository
let scheduleRepository: InMemoryScheduleRepository
let sut: CreateScheduleUseCase

describe('Create schedule use case', () => {
  beforeEach(() => {
    personRepository = new InMemoryPersonRepository()
    hourlyRepository = new InMemoryHourlyRepository()
    scheduleRepository = new InMemoryScheduleRepository()
    sut = new CreateScheduleUseCase(scheduleRepository, hourlyRepository)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })
 

  it('should be able to create a new schedule', async () => {
    vi.setSystemTime(new Date('2024-12-01T10:00:00'))

    const person = await personRepository.create({
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

    const { schedule } = await sut.execute({
      professionalPersonId: person.id,
      averageValue: 150,
      cancellationPolicy: 24,
      initialTime: new Date('2024-12-31T09:00:00'),
      endTime: new Date('2024-12-31T18:00:00'),
      interval: 60,
      isControlled: true,
      observation: 'Atendimento presencial',
    })

    expect(schedule.id).toEqual(expect.any(String))
  })

  it('should not be able to create a new schedule with initial time before the current date', async () => {
    vi.setSystemTime(new Date('2024-12-01T10:00:00'))

    const person = await personRepository.create({
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

    await expect(() =>
      sut.execute({
        professionalPersonId: person.id,
        averageValue: 150,
        cancellationPolicy: 24,
        initialTime: new Date('2024-11-30T09:00:00'),
        endTime: new Date('2024-11-30T18:00:00'),
        interval: 60,
        isControlled: true,
        observation: 'Atendimento presencial',
      })
    ).rejects.toBeInstanceOf(DateNotValidError)
  })})
