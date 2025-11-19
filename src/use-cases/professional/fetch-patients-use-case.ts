import { PersonNotFoundError } from '@/errors/person-not-found'
import type { PersonRepository } from '@/repositories/person-repository'
import type { ProfessionalRepository } from '@/repositories/professional-repository'
import type { SchedulingRepository } from '@/repositories/scheduling-repository'

interface GetPatientsUseCaseRequest {
  professionalId: string
  page: number
}

interface GetPatientsUseCaseReply {
  patient: {
    patientId: string
    patientName: string
    patientAge: number
  }[]
}

export class GetPatientsUseCase {
  constructor(
    private professionalsRepository: ProfessionalRepository,
    private schedulingsRepository: SchedulingRepository,
    private personRepository: PersonRepository
  ) {}

  async execute({
    professionalId,
    page,
  }: GetPatientsUseCaseRequest): Promise<GetPatientsUseCaseReply> {
    const professional =
      await this.professionalsRepository.getById(professionalId)

    if (!professional) {
      throw new PersonNotFoundError()
    }

    const schedulings =
      await this.schedulingsRepository.fetchSchedulingsByProfessionalId(
        professionalId,
        page
      )

    const patients = await Promise.all(
      schedulings.map(async scheduling => {
        return {
          patientId: patient.id,
          patientName: patient.name,
          patientAge: patient.age,
        }
      })
    )
  }
}
