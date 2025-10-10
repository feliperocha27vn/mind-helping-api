import { DateNotValidError } from '@/errors/date-not-valid'
import { PersonNotFoundError } from '@/errors/person-not-found'
import type { ProfessionalRepository } from '@/repositories/professional-repository'
import type { SchedulingRepository } from '@/repositories/scheduling-repository'
import { validateDateTime } from '@/utils/validate-date-time'

interface GetSchedulingsByDateUseCaseRequest {
  professionalId: string
  startDay: Date
  endDay: Date
}

interface GetSchedulingsByDateUseCaseReply {
  schedulingsCount: number | null
}

export class GetSchedulingsByDateUseCase {
  constructor(
    private schedulingRepository: SchedulingRepository,
    private professionalRepository: ProfessionalRepository
  ) {}

  async execute({
    professionalId,
    startDay,
    endDay,
  }: GetSchedulingsByDateUseCaseRequest): Promise<GetSchedulingsByDateUseCaseReply> {
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

    // Passa as datas normalizadas em UTC para o repositório
    const schedulingsCount =
      await this.schedulingRepository.getSchedulingsByDate(
        professionalId,
        normalizedStartDate.dateTimeObj,
        normalizedEndDate.dateTimeObj
      )

    return {
      schedulingsCount,
    }
  }
}
