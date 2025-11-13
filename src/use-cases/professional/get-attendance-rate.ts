import { DateNotValidError } from '@/errors/date-not-valid'
import { PersonNotFoundError } from '@/errors/person-not-found'
import type { ProfessionalRepository } from '@/repositories/professional-repository'
import type { SchedulingRepository } from '@/repositories/scheduling-repository'
import { validateDateTime } from '@/utils/validate-date-time'
import { count } from 'node:console'

interface GetAttendanceRateUseCaseRequest {
  professionalId: string
  startDay: Date
  endDay: Date
}

interface GetAttendanceRateUseCaseReply {
  attendanceRate: number
}

export class GetAttendanceRateUseCase {
  constructor(
    private schedulingRepository: SchedulingRepository,
    private professionalRepository: ProfessionalRepository
  ) { }

  async execute({
    professionalId,
    startDay,
    endDay,
  }: GetAttendanceRateUseCaseRequest): Promise<GetAttendanceRateUseCaseReply> {
    const professional =
      await this.professionalRepository.getById(professionalId)

    if (!professional) {
      throw new PersonNotFoundError()
    }

    // Regra de negócio: validar e normalizar as datas para UTC
    // Extrai a data inicial em UTC para evitar problemas de timezone
    const startYear = startDay.getUTCFullYear()
    const startMonth = String(startDay.getUTCMonth() + 1).padStart(2, '0')
    const startDayOfMonth = String(startDay.getUTCDate()).padStart(2, '0')
    const startDayStr = `${startYear}-${startMonth}-${startDayOfMonth}`

    const normalizedStartDate = validateDateTime(startDayStr, '00:00')

    if (!normalizedStartDate.isValid || !normalizedStartDate.dateTimeObj) {
      throw new DateNotValidError()
    }

    // Extrai a data final em UTC
    const endYear = endDay.getUTCFullYear()
    const endMonth = String(endDay.getUTCMonth() + 1).padStart(2, '0')
    const endDayOfMonth = String(endDay.getUTCDate()).padStart(2, '0')
    const endDayStr = `${endYear}-${endMonth}-${endDayOfMonth}`

    const normalizedEndDate = validateDateTime(endDayStr, '23:59')

    if (!normalizedEndDate.isValid || !normalizedEndDate.dateTimeObj) {
      throw new DateNotValidError()
    }

    const countSchedulings =
      await this.schedulingRepository.getSchedulingsByDate(
        professionalId,
        normalizedStartDate.dateTimeObj,
        normalizedEndDate.dateTimeObj
      )

    const countCanceledSchedulings =
      await this.schedulingRepository.getShedulingsCancelByProfessionalId(
        professionalId,
        normalizedStartDate.dateTimeObj,
        normalizedEndDate.dateTimeObj
      )

    if (
      !countSchedulings ||
      (countSchedulings === 0 && countCanceledSchedulings === 0) ||
      !countCanceledSchedulings
    ) {
      return {
        attendanceRate: 0,
      }
    }

    const countAllSchedulingsCompletedAndCanceled = countSchedulings + countCanceledSchedulings

    const attendanceRate = (
      ((countAllSchedulingsCompletedAndCanceled - countCanceledSchedulings) / countAllSchedulingsCompletedAndCanceled) *
      100
    ).toFixed(0)

    return {
      attendanceRate: Number(attendanceRate),
    }
  }
}
