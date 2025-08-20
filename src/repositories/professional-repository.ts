import type { Prisma, Professional } from '@prisma/client'

export interface ProfessionalRepository {
  create(data: Prisma.ProfessionalUncheckedCreateInput): Promise<Professional>
}
