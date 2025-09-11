import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { HourlyRepository } from '@/repositories/hourly-repository'
import type { ScheduleRepository } from '@/repositories/schedule-repository'
import type { Hourly } from '@prisma/client'

interface FetchManyHourliesByScheduleIdUseCaseRequest {
  scheduleId: string
}

interface FetchManyHourliesByScheduleIdUseCaseReply {
  hourlies: Hourly[]
}

export class FetchManyHourliesByScheduleIdUseCase {
  constructor(
    private hourlyRepository: HourlyRepository,
    private scheduleRepository: ScheduleRepository
  ) {}

  async execute({
    scheduleId,
  }: FetchManyHourliesByScheduleIdUseCaseRequest): Promise<FetchManyHourliesByScheduleIdUseCaseReply> {
    const schedule = await this.scheduleRepository.getById(scheduleId)

    if (!schedule) {
      throw new ResourceNotFoundError()
    }

    const hourlies =
      await this.hourlyRepository.fetchManyByScheduleId(scheduleId)

    return { hourlies }
  }
}
