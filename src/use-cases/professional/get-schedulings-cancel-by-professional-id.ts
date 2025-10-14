import { DateNotValidError } from '@/errors/date-not-valid'
import { PersonNotFoundError } from '@/errors/person-not-found'
import type { ProfessionalRepository } from '@/repositories/professional-repository'
import type { SchedulingRepository } from '@/repositories/scheduling-repository'
import { validateDateTime } from '@/utils/validate-date-time'

interface GetSchedulingsCancelByProfessionalIdRequest {
  professionalId: string
  startDay: Date
  endDay: Date
}

interface GetSchedulingsCancelByProfessionalIdReply {
  schedulingsCancel: number
}

export class GetSchedulingsCancelByProfessionalId {
  constructor(
    private schedulingRepository: SchedulingRepository,
    private professionalRepository: ProfessionalRepository
  ) {}

  async execute({
    professionalId,
    startDay,
    endDay,
  }: GetSchedulingsCancelByProfessionalIdRequest): Promise<GetSchedulingsCancelByProfessionalIdReply> {
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

    const schedulingsCancel =
      await this.schedulingRepository.getShedulingsCancelByProfessionalId(
        professionalId,
        normalizedStartDate.dateTimeObj,
        normalizedEndDate.dateTimeObj
      )

    if (schedulingsCancel === null) {
      return { schedulingsCancel: 0 }
    }

    return { schedulingsCancel }
  }
}
