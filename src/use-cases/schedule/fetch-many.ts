import { NotExistingSchedulesError } from '@/errors/not-existing-schedules'
import { PersonNotFoundError } from '@/errors/person-not-found'
import type { ProfessionalRepository } from '@/repositories/professional-repository'
import type { ScheduleRepository } from '@/repositories/schedule-repository'
import type { Schedule } from '@prisma/client'

interface FetchManySchedulesUseCaseRequest {
  professionalId: string
}

interface FetchManySchedulesUseCaseResponse {
  schedules: Schedule[]
}

export class FetchManySchedulesUseCase {
  constructor(
    private scheduleRepository: ScheduleRepository,
    private professionalRepository: ProfessionalRepository
  ) {}

  async execute({
    professionalId,
  }: FetchManySchedulesUseCaseRequest): Promise<FetchManySchedulesUseCaseResponse> {
    const professional =
      await this.professionalRepository.getById(professionalId)

    if (!professional) {
      throw new PersonNotFoundError()
    }

    const schedules = await this.scheduleRepository.fetchMany(professionalId)

    if (!schedules) {
      throw new NotExistingSchedulesError()
    }

    if (schedules.length === 0) {
      throw new NotExistingSchedulesError()
    }

    return { schedules }
  }
}
