import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { FeelingsRepository } from '@/repositories/feelings-repository'
import type { PersonRepository } from '@/repositories/person-repository'
import type { FeelingsUser } from '@prisma/client'

interface CreateFeelingUserUseCaseRequest {
  description:
    | 'TRISTE'
    | 'ANSIOSO'
    | 'TEDIO'
    | 'RAIVA'
    | 'NÃO_SEI_DIZER'
    | 'FELIZ'
  motive?: string | null
  userPersonId: string
}

interface CreateFeelingUserUseCaseReply {
  feelingsUser: FeelingsUser
}

export class CreateFeelingUserUseCase {
  constructor(
    private feelingsRepository: FeelingsRepository,
    private personRepository: PersonRepository
  ) {}

  async execute({
    description,
    motive,
    userPersonId,
  }: CreateFeelingUserUseCaseRequest): Promise<CreateFeelingUserUseCaseReply> {
    const personUser = await this.personRepository.findById(userPersonId)

    if (!personUser) {
      throw new ResourceNotFoundError()
    }

    const feelingsUser = await this.feelingsRepository.create({
      description,
      motive,
      userPersonId,
    })

    return { feelingsUser }
  }
}
