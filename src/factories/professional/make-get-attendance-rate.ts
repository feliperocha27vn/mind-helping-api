import { PrismaProfessionalRepository } from '@/repositories/prisma/prisma-professional-repository'
import { PrismaSchedulingRepository } from '@/repositories/prisma/prisma-scheduling-repository'
import { GetAttendanceRateUseCase } from '@/use-cases/professional/get-attendance-rate'

export function makeGetAttendanceRate() {
  const schedulingRepository = new PrismaSchedulingRepository()
  const professionalRepository = new PrismaProfessionalRepository()
  const getAttendanceRateUseCase = new GetAttendanceRateUseCase(
    schedulingRepository,
    professionalRepository
  )
  return getAttendanceRateUseCase
}
