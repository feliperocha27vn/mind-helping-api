import { InMemoryHourlyRepository } from '@/in-memory-repository/in-memory-hourly-repository'
import { InMemoryScheduleRepository } from '@/in-memory-repository/in-memory-schedule-repository'
import type { HourlyRepository } from '@/repositories/hourly-repository'
import type { ScheduleRepository } from '@/repositories/schedule-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateNewHourlyUseCase } from './create-new-hourly-use-case'

let hourlyRepository: HourlyRepository
let scheduleRepository: ScheduleRepository
let sut: CreateNewHourlyUseCase

describe('Create new hourly use case', () => {
  beforeEach(() => {
    hourlyRepository = new InMemoryHourlyRepository()
    scheduleRepository = new InMemoryScheduleRepository()
    sut = new CreateNewHourlyUseCase(hourlyRepository, scheduleRepository)
  })

  it('should be able to create a new hourly', async () => {
    const schedule = await scheduleRepository.create({
      averageValue: 100,
      cancellationPolicy: 20,
      isControlled: false,
      professionalPersonId: 'prof-1',
    })

    const { hourly } = await sut.execute({
      scheduleId: schedule.id,
      date: new Date('2024-07-01'),
      hour: '10:00',
    })

    expect(hourly.id).toEqual(expect.any(String))
  })
})
