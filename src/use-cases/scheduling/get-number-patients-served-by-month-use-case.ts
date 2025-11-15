import { PersonNotFoundError } from '@/errors/person-not-found'
import type { ProfessionalRepository } from '@/repositories/professional-repository'
import type { SchedulingRepository } from '@/repositories/scheduling-repository'

interface GetNumberPatientsServedUseCaseRequest {
  professionalId: string
  month: number
}

interface GetNumberPatientsServedUseCaseReply {
  numberPatientsServedByMonth: number
}

export class GetNumberPatientsServedUseCase {
  constructor(
    private schedulingRepository: SchedulingRepository,
    private professionalRepository: ProfessionalRepository
  ) {}

  async execute({
    professionalId,
    month,
  }: GetNumberPatientsServedUseCaseRequest): Promise<GetNumberPatientsServedUseCaseReply> {
    const professional =
      await this.professionalRepository.getById(professionalId)

    if (!professional) {
      throw new PersonNotFoundError()
    }

    const numberPatientsServedByMonth =
      await this.schedulingRepository.getSchedulingsByMonth(
        professionalId,
        month
      )

    return {
      numberPatientsServedByMonth,
    }
  }
}
