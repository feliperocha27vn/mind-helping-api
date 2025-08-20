import type { Prisma } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import type { ProfessionalRepository } from '../professional-repository'

export class PrismaProfessionalRepository implements ProfessionalRepository {
  async create(data: Prisma.ProfessionalUncheckedCreateInput) {
    const professional = await prisma.professional.create({
      data,
    })

    return professional
  }
}
