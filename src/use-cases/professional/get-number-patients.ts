import { PersonNotFoundError } from '@/errors/person-not-found'
import type { ProfessionalRepository } from '@/repositories/professional-repository'
import type { SchedulingRepository } from '@/repositories/scheduling-repository'

interface GetNumberPatientsUseCaseRequest {
  professionalId: string
}

interface GetNumberPatientsUseCaseResponse {
  numberPatients: number
}

export class GetNumberPatientsUseCase {
  constructor(
    private schedulingRepository: SchedulingRepository,
    private professionalRepository: ProfessionalRepository
  ) {}

  async execute({
    professionalId,
  }: GetNumberPatientsUseCaseRequest): Promise<GetNumberPatientsUseCaseResponse> {
    const professional =
      await this.professionalRepository.getById(professionalId)

    if (!professional) {
      throw new PersonNotFoundError()
    }

    const numberPatients =
      await this.schedulingRepository.getPatientsByProfessionalId(
        professionalId
      )

    return { numberPatients: numberPatients ?? 0 }
  }
}
