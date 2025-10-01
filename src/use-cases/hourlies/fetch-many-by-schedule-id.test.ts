import { InMemoryHourlyRepository } from '@/in-memory-repository/in-memory-hourly-repository'
import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { InMemoryProfessionalRepository } from '@/in-memory-repository/in-memory-professional-repository'
import { InMemoryScheduleRepository } from '@/in-memory-repository/in-memory-schedule-repository'
import type { HourlyRepository } from '@/repositories/hourly-repository'
import type { ScheduleRepository } from '@/repositories/schedule-repository'
import { CreateScheduleUseCase } from '@/use-cases/schedule/create'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FetchManyHourliesByScheduleIdUseCase } from './fetch-many-by-schedule-id'

let hourlyRepository: HourlyRepository
let scheduleRepository: ScheduleRepository
let personRepository: InMemoryPersonRepository
let professionalRepository: InMemoryProfessionalRepository
let createScheduleUseCase: CreateScheduleUseCase
let sut: FetchManyHourliesByScheduleIdUseCase

describe('Fetch many hourlies by schedule id use case', () => {
  beforeEach(() => {
    hourlyRepository = new InMemoryHourlyRepository()
    scheduleRepository = new InMemoryScheduleRepository()
    personRepository = new InMemoryPersonRepository()
    professionalRepository = new InMemoryProfessionalRepository(
      personRepository
    )
    createScheduleUseCase = new CreateScheduleUseCase(
      scheduleRepository,
      hourlyRepository,
      professionalRepository
    )
    sut = new FetchManyHourliesByScheduleIdUseCase(
      hourlyRepository,
      scheduleRepository
    )

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to fetch many hourlies by schedule id', async () => {
    vi.setSystemTime(new Date('2024-12-01T10:00:00'))

    // Primeiro criamos uma pessoa
    const person = await personRepository.create({
      id: 'professional-1',
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
      password_hash: 'hashed-password',
    })

    // Depois criamos o profissional
    await professionalRepository.create({
      person_id: person.id,
      crp: '06/123456',
      voluntary: true,
    })

    // Usa o CreateScheduleUseCase para criar o schedule E os hourlies automaticamente
    const { schedule } = await createScheduleUseCase.execute({
      professionalPersonId: 'professional-1',
      averageValue: 150,
      cancellationPolicy: 24,
      initialTime: new Date('2024-12-31T09:00:00.000Z'),
      endTime: new Date('2024-12-31T18:00:00.000Z'),
      interval: 60,
      isControlled: true, // Importante: true para criar os hourlies automaticamente
      observation: 'Atendimento presencial',
    })

    const { hourlies } = await sut.execute({ scheduleId: schedule.id })

    // Com intervalo de 60 minutos, de 09:00 às 18:00, devem ser criados 9 hourlies
    // 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00, 17:00
    expect(hourlies).toHaveLength(9)
    expect(hourlies[0].scheduleId).toBe(schedule.id)
    expect(hourlies[0].hour).toBe('09:00')
    expect(hourlies[8].hour).toBe('17:00')
  })
})
