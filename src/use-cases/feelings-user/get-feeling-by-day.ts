import { DateNotValidError } from '@/errors/date-not-valid'
import { PersonNotFoundError } from '@/errors/person-not-found'
import type { FeelingsRepository } from '@/repositories/feelings-repository'
import type { PersonRepository } from '@/repositories/person-repository'
import type { UserRepository } from '@/repositories/user-repository'
import { validateDateTime } from '@/utils/validate-date-time'
import type { FeelingsUser } from '@prisma/client'

interface GetFeelingByDayUseCaseRequest {
  userId: string
  day: Date
}

interface GetFeelingByDayUseCaseReply {
  feelings: FeelingsUser[]
}

export class GetFeelingByDayUseCase {
  constructor(
    private personRepository: PersonRepository,
    private userRepository: UserRepository,
    private feelingsRepository: FeelingsRepository
  ) {}

  async execute({
    userId,
    day,
  }: GetFeelingByDayUseCaseRequest): Promise<GetFeelingByDayUseCaseReply> {
    const person = await this.personRepository.findById(userId)

    if (!person) {
      throw new PersonNotFoundError()
    }

    const user = await this.userRepository.getById(person.id)

    if (!user) {
      throw new PersonNotFoundError()
    }

    // Regra de negócio: validar e normalizar a data para UTC
    // Extrai a data em UTC para evitar problemas de timezone
    const year = day.getUTCFullYear()
    const month = String(day.getUTCMonth() + 1).padStart(2, '0')
    const dayOfMonth = String(day.getUTCDate()).padStart(2, '0')
    const dayStr = `${year}-${month}-${dayOfMonth}`

    const normalizedDate = validateDateTime(dayStr, '00:00')

    if (!normalizedDate.isValid || !normalizedDate.dateTimeObj) {
      throw new DateNotValidError()
    }

    // Passa a data normalizada em UTC para o repositório
    const feelings = await this.feelingsRepository.getFeelingsByDay(
      userId,
      normalizedDate.dateTimeObj
    )

    return {
      feelings,
    }
  }
}
