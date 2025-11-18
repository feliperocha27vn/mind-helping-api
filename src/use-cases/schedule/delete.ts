import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { ScheduleRepository } from '@/repositories/schedule-repository'

interface DeleteScheduleUseCaseRequest {
  scheduleId: string
}

export class DeleteScheduleUseCase {
  constructor(private scheduleRepository: ScheduleRepository) {}

  async execute({ scheduleId }: DeleteScheduleUseCaseRequest): Promise<void> {
    const schedule = await this.scheduleRepository.getById(scheduleId)

    if (!schedule) {
      throw new ResourceNotFoundError()
    }

    await this.scheduleRepository.delete(scheduleId)
  }
}
