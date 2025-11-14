import { PersonNotFoundError } from '@/errors/person-not-found'
import type { HourlyRepository } from '@/repositories/hourly-repository'
import type { PersonRepository } from '@/repositories/person-repository'
import type { SchedulingRepository } from '@/repositories/scheduling-repository'

interface FetchManySchedulingsByScheduleIdUseCaseRequest {
  scheduleId: string
  startDay: Date
  endDay: Date
  page: number
}

interface FetchManySchedulingsByScheduleIdUseCaseReply {
  schedulings: {
    pacientId: string
    schedulingId: string
    namePacient: string
    hour: string
  }[]
}

export class FetchManySchedulingsByScheduleIdUseCase {
  constructor(
    private schedulingRepository: SchedulingRepository,
    private personRepository: PersonRepository,
    private hourlyRepository: HourlyRepository
  ) {}

  async execute({
    scheduleId,
    startDay,
    endDay,
    page,
  }: FetchManySchedulingsByScheduleIdUseCaseRequest): Promise<FetchManySchedulingsByScheduleIdUseCaseReply> {
    const hourlies = await this.hourlyRepository.fetchManyByScheduleIdAndDate(
      scheduleId,
      startDay,
      endDay,
      page
    )

    const schedulingsWithPacient: {
      pacientId: string
      schedulingId: string
      namePacient: string
      hour: string
    }[] = []

    for (const hourly of hourlies) {
      const schedullings = await this.schedulingRepository.getByHourlyId(
        hourly.id
      )

      for (const scheduling of schedullings) {
        const person = await this.personRepository.findById(
          scheduling.userPersonId
        )

        if (!person) {
          throw new PersonNotFoundError()
        }

        schedulingsWithPacient.push({
          schedulingId: scheduling.id,
          namePacient: person.name,
          hour: hourly.hour,
          pacientId: person.id,
        })
      }
    }

    return { schedulings: schedulingsWithPacient }
  }
}
