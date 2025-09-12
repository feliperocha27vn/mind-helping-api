import { DateNotValidError } from '@/errors/date-not-valid'
import type { HourlyRepository } from '@/repositories/hourly-repository'
import type { ScheduleRepository } from '@/repositories/schedule-repository'
import type { Prisma, Schedule } from '@prisma/client'
import { addMinutes, format, isBefore, isValid } from 'date-fns'

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

    if (schedule.isControlled) {
      const dateIsValid = isValid(initialTime) && isValid(endTime)

      if (initialTime < new Date()) {
        throw new DateNotValidError()
      }

      if (!dateIsValid) {
        throw new DateNotValidError()
      }

      const hourlies: Prisma.HourlyUncheckedCreateInput[] = []
      let currentTime = new Date(initialTime) // Cria uma cópia para não modificar o original

      while (isBefore(currentTime, endTime)) {
        hourlies.push({
          date: new Date(currentTime),
          hour: format(currentTime, 'HH:mm'),
          scheduleId: schedule.id,
        })

        // Incrementa o tempo pelo intervalo especificado
        currentTime = addMinutes(currentTime, interval)
      }

      if (hourlies.length > 0) {
        await this.hourlyRepository.createMany(hourlies)
      }
    }

    return { schedule }
  }
}
