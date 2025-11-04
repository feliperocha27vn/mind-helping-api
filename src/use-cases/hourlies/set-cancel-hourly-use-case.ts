import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { HourlyRepository } from '@/repositories/hourly-repository'
import type { Hourly } from '@prisma/client'

interface SetCancelHourlyUseCaseRequest {
  hourlyId: string
}

interface SetCancelHourlyUseCaseReply {
  hourly: Hourly
}

export class SetCancelHourlyUseCase {
  constructor(private hourlyRepository: HourlyRepository) {}

  async execute({
    hourlyId,
  }: SetCancelHourlyUseCaseRequest): Promise<SetCancelHourlyUseCaseReply> {
    const hourly = await this.hourlyRepository.setCancelHourly(hourlyId)

    if (!hourly) {
      throw new ResourceNotFoundError()
    }

    return { hourly }
  }
}
