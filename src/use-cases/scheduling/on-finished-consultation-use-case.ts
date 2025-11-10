import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { SchedulingRepository } from '@/repositories/scheduling-repository'
import type { Scheduling } from '@prisma/client'

interface OnFinishedConsultationUseCaseRequest {
  schedulingId: string
}

interface OnFinishedConsultationUseCaseReply {
  scheduling: Scheduling
}

export class OnFinishedConsultationUseCase {
  constructor(private schedulingRepository: SchedulingRepository) {}

  async execute({
    schedulingId,
  }: OnFinishedConsultationUseCaseRequest): Promise<OnFinishedConsultationUseCaseReply> {
    const scheduling = await this.schedulingRepository.getById(schedulingId)

    if (!scheduling) {
      throw new ResourceNotFoundError()
    }

    await this.schedulingRepository.onFinishedConsultation(schedulingId)

    return { scheduling }
  }
}
