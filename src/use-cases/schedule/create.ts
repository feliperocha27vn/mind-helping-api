import { DateNotValidError } from '@/errors/date-not-valid'
import { PersonNotFoundError } from '@/errors/person-not-found'
import type { HourlyRepository } from '@/repositories/hourly-repository'
import type { ProfessionalRepository } from '@/repositories/professional-repository'
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
    private hourlyRepository: HourlyRepository,
    private professionalRepository: ProfessionalRepository
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
    const professionalPerson =
      await this.professionalRepository.getById(professionalPersonId)

    if (!professionalPerson) {
      throw new PersonNotFoundError()
    }

    const finalAverageValue = professionalPerson.voluntary ? 0 : averageValue

    const schedule = await this.scheduleRepository.create({
      professionalPersonId,
      averageValue: finalAverageValue,
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
