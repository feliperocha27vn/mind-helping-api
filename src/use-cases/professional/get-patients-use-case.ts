import { PersonNotFoundError } from '@/errors/person-not-found'
import type { ProfessionalRepository } from '@/repositories/professional-repository'

interface GetPatientsUseCaseRequest {
  professionalId: string
}

interface GetPatientsUseCaseReply {
  patient: {
    patientId: string
    patientName: string
    patientAge: number
  }[]
}

export class GetPatientsUseCase {
  constructor(private professionalsRepository: ProfessionalRepository) {}

  async execute({
    professionalId,
  }: GetPatientsUseCaseRequest): Promise<GetPatientsUseCaseReply> {
    const professional =
      await this.professionalsRepository.getById(professionalId)

    if (!professional) {
      throw new PersonNotFoundError()
    }
  }
}
