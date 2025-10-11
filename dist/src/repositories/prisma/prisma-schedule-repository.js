"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaScheduleRepository = void 0;
const prisma_1 = require("@/lib/prisma");
class PrismaScheduleRepository {
    async create(data) {
        const schedule = await prisma_1.prisma.schedule.create({
            data,
        });
        return schedule;
    }
    async getById(id) {
        const schedule = await prisma_1.prisma.schedule.findUnique({
            where: { id },
        });
        return schedule;
    }
    async fetchMany(professionalPersonId) {
        const schedules = await prisma_1.prisma.schedule.findMany({
            where: { professionalPersonId },
        });
        return schedules;
    }
}
exports.PrismaScheduleRepository = PrismaScheduleRepository;
