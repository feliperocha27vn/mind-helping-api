import { DateNotValidError } from '@/errors/date-not-valid'
import { PersonNotFoundError } from '@/errors/person-not-found'
import type { FeelingsRepository } from '@/repositories/feelings-repository'
import type { PersonRepository } from '@/repositories/person-repository'
import type { UserRepository } from '@/repositories/user-repository'
import { validateDateTime } from '@/utils/validate-date-time'
import type { FeelingsUser } from '@prisma/client'

interface GetFeelingsByDateUseCaseRequest {
  userId: string
  day?: Date
  startDay?: Date
  endDay?: Date
}

interface GetFeelingsByDateUseCaseReply {
  feelings: FeelingsUser[]
}

export class GetFeelingsByDateUseCase {
  constructor(
    private personRepository: PersonRepository,
    private userRepository: UserRepository,
    private feelingsRepository: FeelingsRepository
  ) {}

  async execute({
    userId,
    day,
    startDay,
    endDay,
  }: GetFeelingsByDateUseCaseRequest): Promise<GetFeelingsByDateUseCaseReply> {
    const person = await this.personRepository.findById(userId)

    if (!person) {
      throw new PersonNotFoundError()
    }

    const user = await this.userRepository.getById(person.id)

    if (!user) {
      throw new PersonNotFoundError()
    }

    // Se 'day' for fornecido, usa como startDay e endDay (backward compatibility)
    // Caso contrário, usa startDay e endDay fornecidos explicitamente
    const actualStartDay = day || startDay
    const actualEndDay = day || endDay

    if (!actualStartDay || !actualEndDay) {
      throw new DateNotValidError()
    }

    // Regra de negócio: validar e normalizar as datas para UTC
    // Extrai a data inicial em UTC para evitar problemas de timezone
    const startYear = actualStartDay.getUTCFullYear()
    const startMonth = String(actualStartDay.getUTCMonth() + 1).padStart(2, '0')
    const startDayOfMonth = String(actualStartDay.getUTCDate()).padStart(2, '0')
    const startDayStr = `${startYear}-${startMonth}-${startDayOfMonth}`

    const normalizedStartDate = validateDateTime(startDayStr, '00:00')

    if (!normalizedStartDate.isValid || !normalizedStartDate.dateTimeObj) {
      throw new DateNotValidError()
    }

    // Extrai a data final em UTC
    const endYear = actualEndDay.getUTCFullYear()
    const endMonth = String(actualEndDay.getUTCMonth() + 1).padStart(2, '0')
    const endDayOfMonth = String(actualEndDay.getUTCDate()).padStart(2, '0')
    const endDayStr = `${endYear}-${endMonth}-${endDayOfMonth}`

    const normalizedEndDate = validateDateTime(endDayStr, '23:59')

    if (!normalizedEndDate.isValid || !normalizedEndDate.dateTimeObj) {
      throw new DateNotValidError()
    }

    // Passa as datas normalizadas em UTC para o repositório
    const feelings = await this.feelingsRepository.getFeelingsByDate(
      userId,
      normalizedStartDate.dateTimeObj,
      normalizedEndDate.dateTimeObj
    )

    return {
      feelings,
    }
  }
}
