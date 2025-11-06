import { DateNotValidError } from '@/errors/date-not-valid'
import { PersonNotFoundError } from '@/errors/person-not-found'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { HourlyRepository } from '@/repositories/hourly-repository'
import type { PersonRepository } from '@/repositories/person-repository'
import type { SchedulingRepository } from '@/repositories/scheduling-repository'
import type { UserRepository } from '@/repositories/user-repository'
import { validateDateTime } from '@/utils/validate-date-time'

interface FetchSchedulingsByProfessionalIdUseCaseRequest {
  professionalId: string
  startDay: Date
  endDay: Date
}

interface FetchSchedulingsByProfessionalIdUseCaseReply {
  schedulings: {
    schedulingId: string
    namePacient: string
    hour: string
  }[]
}

export class FetchSchedulingsByProfessionalIdUseCase {
  constructor(
    private schedulingRepository: SchedulingRepository,
    private personRepository: PersonRepository,
    private usersRepository: UserRepository,
    private hourlyRepository: HourlyRepository
  ) {}

  async execute({
    professionalId,
    startDay,
    endDay,
  }: FetchSchedulingsByProfessionalIdUseCaseRequest): Promise<FetchSchedulingsByProfessionalIdUseCaseReply> {
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

    const schedulings =
      await this.schedulingRepository.fetchSchedulingByProfessionalId(
        professionalId,
        normalizedStartDate.dateTimeObj,
        normalizedEndDate.dateTimeObj
      )

    // Se não houver agendamentos, retorna array vazio
    if (schedulings.length === 0) {
      return { schedulings: [] }
    }

    const user = await this.usersRepository.getById(schedulings[0].userPersonId)

    if (!user) {
      throw new PersonNotFoundError()
    }

    const person = await this.personRepository.findById(user.person_id)

    if (!person) {
      throw new PersonNotFoundError()
    }

    const schedulingsWithPacientName = await Promise.all(
      schedulings.map(async scheduling => {
        const hourly = await this.hourlyRepository.getById(scheduling.hourlyId)

        if (!hourly) {
          throw new ResourceNotFoundError()
        }

        return {
          schedulingId: scheduling.id,
          namePacient: person.name,
          hour: hourly.hour,
        }
      })
    )

    return { schedulings: schedulingsWithPacientName }
  }
}
