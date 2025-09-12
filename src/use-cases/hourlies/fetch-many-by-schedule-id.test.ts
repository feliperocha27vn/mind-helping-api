import { InMemoryHourlyRepository } from '@/in-memory-repository/in-memory-hourly-repository'
import { InMemoryScheduleRepository } from '@/in-memory-repository/in-memory-schedule-repository'
import type { HourlyRepository } from '@/repositories/hourly-repository'
import type { ScheduleRepository } from '@/repositories/schedule-repository'
import { CreateScheduleUseCase } from '@/use-cases/schedule/create'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FetchManyHourliesByScheduleIdUseCase } from './fetch-many-by-schedule-id'

let hourlyRepository: HourlyRepository
let scheduleRepository: ScheduleRepository
let createScheduleUseCase: CreateScheduleUseCase
let sut: FetchManyHourliesByScheduleIdUseCase

describe('Fetch many hourlies by schedule id use case', () => {
  beforeEach(() => {
    hourlyRepository = new InMemoryHourlyRepository()
    scheduleRepository = new InMemoryScheduleRepository()
    createScheduleUseCase = new CreateScheduleUseCase(
      scheduleRepository,
      hourlyRepository
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
    // Usa o CreateScheduleUseCase para criar o schedule E os hourlies automaticamente
    const { schedule } = await createScheduleUseCase.execute({
      professionalPersonId: 'professional-1',
      averageValue: 150,
      cancellationPolicy: 24,
      initialTime: new Date('2024-12-31T09:00:00'),
      endTime: new Date('2024-12-31T18:00:00'),
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
