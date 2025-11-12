import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { HourlyRepository } from '@/repositories/hourly-repository'
import type { ScheduleRepository } from '@/repositories/schedule-repository'
import type { Hourly } from '@prisma/client'

interface CreateNewHourlyUseCaseRequest {
  scheduleId: string
  date: Date
  hour: string
}

interface CreateNewHourlyUseCaseReply {
  hourly: Hourly
}

export class CreateNewHourlyUseCase {
  constructor(
    private hourlyRepository: HourlyRepository,
    private scheduleRepository: ScheduleRepository
  ) {}

  async execute({
    scheduleId,
    date,
    hour,
  }: CreateNewHourlyUseCaseRequest): Promise<CreateNewHourlyUseCaseReply> {
    const schedule = await this.scheduleRepository.getById(scheduleId)

    if (!schedule) {
      throw new ResourceNotFoundError()
    }

    const hourly = await this.hourlyRepository.create({
      scheduleId,
      date,
      hour,
    })

    return { hourly }
  }
}
