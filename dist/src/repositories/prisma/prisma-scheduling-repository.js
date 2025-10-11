"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaSchedulingRepository = void 0;
const prisma_1 = require("@/lib/prisma");
class PrismaSchedulingRepository {
    async create(data) {
        const scheduling = await prisma_1.prisma.scheduling.create({
            data,
        });
        return scheduling;
    }
    async getByUserId(userId) {
        const scheduling = await prisma_1.prisma.scheduling.findFirst({
            where: { userPersonId: userId },
            orderBy: { createdAt: 'desc' },
        });
        return scheduling;
    }
    async getPatientsByProfessionalId(professionalId) {
        const patients = await prisma_1.prisma.scheduling.findMany({
            where: { professionalPersonId: professionalId },
            distinct: ['userPersonId'],
        });
        const numberPatients = patients.length;
        return numberPatients;
    }
    async getSchedulingsByDate(professionalId, startDay, endDay) {
        const schedulings = await prisma_1.prisma.scheduling.findMany({
            where: {
                professionalPersonId: professionalId,
                createdAt: {
                    gte: startDay,
                    lte: endDay,
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
        const schedulingsCount = schedulings.length;
        if (schedulingsCount === 0) {
            return null;
        }
        return schedulingsCount;
    }
}
exports.PrismaSchedulingRepository = PrismaSchedulingRepository;
