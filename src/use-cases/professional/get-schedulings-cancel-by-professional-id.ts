import { PersonNotFoundError } from '@/errors/person-not-found'
import type { ProfessionalRepository } from '@/repositories/professional-repository'
import type { SchedulingRepository } from '@/repositories/scheduling-repository'

interface GetSchedulingsCancelByProfessionalIdRequest {
  professionalId: string
}

interface GetSchedulingsCancelByProfessionalIdReply {
  schedulingsCancel: number
}

export class GetSchedulingsCancelByProfessionalId {
  constructor(
    private schedulingRepository: SchedulingRepository,
    private professionalRepository: ProfessionalRepository
  ) {}

  async execute({
    professionalId,
  }: GetSchedulingsCancelByProfessionalIdRequest): Promise<GetSchedulingsCancelByProfessionalIdReply> {
    const professional =
      await this.professionalRepository.getById(professionalId)

    if (!professional) {
      throw new PersonNotFoundError()
    }

    const schedulingsCancel =
      await this.schedulingRepository.getShedulingsCancelByProfessionalId(
        professionalId
      )

    if (schedulingsCancel === null) {
      return { schedulingsCancel: 0 }
    }

    return { schedulingsCancel }
  }
}
