import { DateNotValidError } from '@/errors/date-not-valid'
import { PersonNotFoundError } from '@/errors/person-not-found'
import type { HourlyRepository } from '@/repositories/hourly-repository'
import type { ProfessionalRepository } from '@/repositories/professional-repository'
import type { ScheduleRepository } from '@/repositories/schedule-repository'
import type { Schedule } from '@prisma/client'
import { isValid } from 'date-fns'

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

// Função para ajustar a data ao fuso horário local antes de salvar
function adjustToLocalTimezone(date: Date): Date {
  const offset = date.getTimezoneOffset() * 60000 // converte minutos para milissegundos
  return new Date(date.getTime() - offset)
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

        // Ajusta as datas para o fuso horário local antes de salvar
        const adjustedInitialTime = adjustToLocalTimezone(initialTime)
        const adjustedEndTime = adjustToLocalTimezone(endTime)

        const schedule = await this.scheduleRepository.create({
          professionalPersonId,
          averageValue: finalAverageValue,
          cancellationPolicy,
          observation,
          interval,
          isControlled,
          initialTime: adjustedInitialTime,
          endTime: adjustedEndTime,
        })

        if (scheduleItem.initialTime < new Date()) {
          throw new DateNotValidError()
        }

        if (schedule.isControlled) {
          const dateIsValid =
            isValid(scheduleItem.initialTime) && isValid(scheduleItem.endTime)

          if (!dateIsValid) {
            throw new DateNotValidError()
          }

          // Usa o método do repositório para criar os horários (usa as datas ajustadas)
          await this.hourlyRepository.createHourlySlots(
            schedule.id,
            adjustedInitialTime,
            adjustedEndTime,
            scheduleItem.interval
          )
        }

        return schedule
      })
    )

    return { schedule: createdSchedules }
  }
}
