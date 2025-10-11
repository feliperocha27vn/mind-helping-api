"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaFeelingsRepository = void 0;
const prisma_1 = require("@/lib/prisma");
class PrismaFeelingsRepository {
    async create(data) {
        const feeling = await prisma_1.prisma.feelingsUser.create({
            data,
        });
        return feeling;
    }
    async getLastFeelingsByUserId(userId) {
        const feeling = await prisma_1.prisma.feelingsUser.findFirst({
            where: {
                userPersonId: userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return feeling;
    }
    async getFeelingsByDate(userId, startDay, endDay) {
        const feelings = await prisma_1.prisma.feelingsUser.findMany({
            where: {
                userPersonId: userId,
                createdAt: {
                    gte: startDay,
                    lte: endDay,
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
        return feelings;
    }
}
exports.PrismaFeelingsRepository = PrismaFeelingsRepository;
