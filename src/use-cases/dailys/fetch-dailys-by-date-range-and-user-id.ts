import { DateNotValidError } from '@/errors/date-not-valid'
import { PersonNotFoundError } from '@/errors/person-not-found'
import type { DailyRepository } from '@/repositories/daily-repository'
import type { UserRepository } from '@/repositories/user-repository'
import { validateDateTime } from '@/utils/validate-date-time'
import type { Daily } from '@prisma/client'

interface FetchDailysByDateRangeAndUserIdUseCaseRequest {
  userId: string
  startDay: Date
  endDay: Date
}

interface FetchDailysByDateRangeAndUserIdUseCaseReply {
  dailys: Daily[]
}

export class FetchDailysByDateRangeAndUserIdUseCase {
  constructor(
    private dailyRepository: DailyRepository,
    private userRepository: UserRepository
  ) {}

  async execute({
    userId,
    startDay,
    endDay,
  }: FetchDailysByDateRangeAndUserIdUseCaseRequest): Promise<FetchDailysByDateRangeAndUserIdUseCaseReply> {
    const user = await this.userRepository.getById(userId)

    if (!user) {
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

    const dailys = await this.dailyRepository.fetchDailysByDateRangeAndUserId(
      userId,
      normalizedStartDate.dateTimeObj,
      normalizedEndDate.dateTimeObj
    )

    return { dailys }
  }
}
