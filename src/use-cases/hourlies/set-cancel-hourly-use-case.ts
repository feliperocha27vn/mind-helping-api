import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { HourlyRepository } from '@/repositories/hourly-repository'
import type { SchedulingRepository } from '@/repositories/scheduling-repository'
import type { Hourly } from '@prisma/client'

interface SetCancelHourlyUseCaseRequest {
  hourlyId: string
  schedulingId: string
}

interface SetCancelHourlyUseCaseReply {
  hourly: Hourly
}

export class SetCancelHourlyUseCase {
  constructor(
    private hourlyRepository: HourlyRepository,
    private schedulingRepository: SchedulingRepository
  ) {}

  async execute({
    hourlyId,
    schedulingId,
  }: SetCancelHourlyUseCaseRequest): Promise<SetCancelHourlyUseCaseReply> {
    const hourly = await this.hourlyRepository.setCancelHourly(hourlyId)

    if (!hourly) {
      throw new ResourceNotFoundError()
    }

    await this.schedulingRepository.setCancelScheduling(schedulingId)

    return { hourly }
  }
}
