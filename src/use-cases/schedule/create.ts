import { DateNotValidError } from '@/errors/date-not-valid'
import type { HourlyRepository } from '@/repositories/hourly-repository'
import type { ScheduleRepository } from '@/repositories/schedule-repository'
import type { Schedule } from '@prisma/client'
import { isValid } from 'date-fns'

interface CreateScheduleUseCaseRequest {
  professionalPersonId: string
  initialTime: Date
  endTime: Date
  interval: number
  cancellationPolicy: number
  averageValue: number
  observation: string
  isControlled: boolean
}

interface CreateScheduleUseCaseReply {
  schedule: Schedule
}

export class CreateScheduleUseCase {
  constructor(
    private scheduleRepository: ScheduleRepository,
    private hourlyRepository: HourlyRepository
  ) {}

  async execute({
    professionalPersonId,
    averageValue,
    cancellationPolicy,
    endTime,
    initialTime,
    interval,
    isControlled,
    observation,
  }: CreateScheduleUseCaseRequest): Promise<CreateScheduleUseCaseReply> {
    const schedule = await this.scheduleRepository.create({
      professionalPersonId,
      averageValue,
      cancellationPolicy,
      observation,
      interval,
      isControlled,
    })

    if (initialTime < new Date()) {
      throw new DateNotValidError()
    }

    if (schedule.isControlled) {
      const dateIsValid = isValid(initialTime) && isValid(endTime)

      if (!dateIsValid) {
        throw new DateNotValidError()
      }

      // Usa o método do repositório para criar os horários
      await this.hourlyRepository.createHourlySlots(
        schedule.id,
        initialTime,
        endTime,
        interval
      )
    }

    return { schedule }
  }
}
