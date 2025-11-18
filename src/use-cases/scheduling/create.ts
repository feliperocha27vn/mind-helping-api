import { DateNotValidError } from '@/errors/date-not-valid'
import { InvalidParametersError } from '@/errors/invalid-parameters'
import { PersonNotFoundError } from '@/errors/person-not-found'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { HourlyRepository } from '@/repositories/hourly-repository'
import type { ProfessionalRepository } from '@/repositories/professional-repository'
import type { ScheduleRepository } from '@/repositories/schedule-repository'
import type { SchedulingRepository } from '@/repositories/scheduling-repository'
import type { UserRepository } from '@/repositories/user-repository'
import { validateDateTime } from '@/utils/validate-date-time'
import type { Scheduling } from '@prisma/client'
import { addHours, isBefore, parse } from 'date-fns'

interface CreateSchedulingUseCaseRequest {
  professionalPersonId: string
  userPersonId: string
  scheduleId: string
  hour: string
  date: string
}

interface CreateSchedulingUseCaseResponse {
  scheduling: Scheduling
}

export class CreateSchedulingUseCase {
  constructor(
    private scheduleRepository: ScheduleRepository,
    private schedulingRepository: SchedulingRepository,
    private hourlyRepository: HourlyRepository,
    private professionalRepository: ProfessionalRepository,
    private userRepository: UserRepository
  ) {}

  async execute({
    date,
    hour,
    scheduleId,
    professionalPersonId,
    userPersonId,
  }: CreateSchedulingUseCaseRequest): Promise<CreateSchedulingUseCaseResponse> {
    const professional =
      await this.professionalRepository.getById(professionalPersonId)

    if (!professional) {
      throw new PersonNotFoundError()
    }

    const user = await this.userRepository.getById(userPersonId)

    if (!user) {
      throw new PersonNotFoundError()
    }

    const schedule = await this.scheduleRepository.getById(scheduleId)

    if (!schedule) {
      throw new ResourceNotFoundError()
    }

    // Valida e normaliza a data e hora
    const validation = validateDateTime(date, hour)

    if (!validation.isValid || !validation.dateTimeObj) {
      throw new InvalidParametersError()
    }

    const { dateTimeObj } = validation

    const hourly = await this.hourlyRepository.getHourlyByDateAndHour(
      dateTimeObj,
      hour
    )

    if (!hourly) {
      throw new ResourceNotFoundError()
    }

    // Combina a data do horário com a hora para validar
    const schedulingDateTime = parse(
      hourly.hour,
      'HH:mm',
      new Date(hourly.date)
    )

    // Valida considerando timezone BRT (UTC-3)
    // O horário no banco está em horário local (12:00 = meio-dia BRT)
    // Para validar, convertemos para UTC: 12:00 BRT = 15:00 UTC
    const schedulingDateTimeUTC = addHours(schedulingDateTime, 3)

    if (isBefore(schedulingDateTimeUTC, new Date())) {
      throw new DateNotValidError()
    }

    const scheduling = await this.schedulingRepository.create({
      hourlyId: hourly.id,
      professionalPersonId,
      userPersonId,
    })

    await this.hourlyRepository.updateStatusOcuped(hourly.id)

    return { scheduling }
  }
}
