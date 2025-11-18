import { DateNotValidError } from '@/errors/date-not-valid'
import { PersonNotFoundError } from '@/errors/person-not-found'
import type { HourlyRepository } from '@/repositories/hourly-repository'
import type { ProfessionalRepository } from '@/repositories/professional-repository'
import type { ScheduleRepository } from '@/repositories/schedule-repository'
import type { Schedule } from '@prisma/client'
import { addHours, isBefore, isValid } from 'date-fns'

interface CreateScheduleUseCaseRequest {
  professionalPersonId: string
  schedules: Array<{
    initialTime: Date
    endTime: Date
    interval: number
    cancellationPolicy: number
    averageValue: number
    observation: string
    isControlled: boolean
  }>
}

interface CreateScheduleUseCaseReply {
  schedule: Schedule[]
}

export class CreateScheduleUseCase {
  constructor(
    private scheduleRepository: ScheduleRepository,
    private hourlyRepository: HourlyRepository,
    private professionalRepository: ProfessionalRepository
  ) {}

  async execute({
    professionalPersonId,
    schedules,
  }: CreateScheduleUseCaseRequest): Promise<CreateScheduleUseCaseReply> {
    const professionalPerson =
      await this.professionalRepository.getById(professionalPersonId)

    if (!professionalPerson) {
      throw new PersonNotFoundError()
    }

    const createdSchedules = await Promise.all(
      schedules.map(async scheduleItem => {
        const {
          initialTime,
          endTime,
          interval,
          cancellationPolicy,
          averageValue,
          observation,
          isControlled,
        } = scheduleItem

        const finalAverageValue = professionalPerson.voluntary
          ? 0
          : averageValue

        const schedule = await this.scheduleRepository.create({
          professionalPersonId,
          averageValue: finalAverageValue,
          cancellationPolicy,
          observation,
          interval,
          isControlled,
          initialTime,
          endTime,
        })

        if (schedule.isControlled) {
          const dateIsValid =
            isValid(scheduleItem.initialTime) && isValid(scheduleItem.endTime)

          if (!dateIsValid) {
            throw new DateNotValidError()
          }

          // Valida se o horário não é retroativo
          // O frontend envia "12:00:00.000Z" querendo dizer 12h00 BRT (horário local)
          // Para validar, convertemos para UTC: 12h00 BRT = 15h00 UTC
          const initialTimeUTC = addHours(scheduleItem.initialTime, 3)

          if (isBefore(initialTimeUTC, new Date())) {
            throw new DateNotValidError()
          }

          // Salva os horários SEM conversão (mantém o horário que o frontend enviou)
          await this.hourlyRepository.createHourlySlots(
            schedule.id,
            initialTime,
            endTime,
            scheduleItem.interval
          )
        }

        return schedule
      })
    )

    return { schedule: createdSchedules }
  }
}
