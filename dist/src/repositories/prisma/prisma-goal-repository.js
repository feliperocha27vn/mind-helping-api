"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaGoalRepository = void 0;
const prisma_1 = require("@/lib/prisma");
class PrismaGoalRepository {
    async create(data) {
        const goal = await prisma_1.prisma.goal.create({
            data,
        });
        return goal;
    }
    async findById(goalId) {
        const goal = await prisma_1.prisma.goal.findUnique({
            where: {
                id: goalId,
            },
        });
        return goal;
    }
    async delete(goalId, personId) {
        await prisma_1.prisma.goal.deleteMany({
            where: {
                id: goalId,
                userPersonId: personId,
            },
        });
    }
    async fetchManyGoals(personId) {
        const goals = await prisma_1.prisma.goal.findMany({
            where: {
                userPersonId: personId,
            },
            orderBy: { createdAt: 'desc' },
        });
        return goals;
    }
    async update(goalId, personId, goal) {
        const updatedGoal = await prisma_1.prisma.goal.update({
            where: {
                id: goalId,
                userPersonId: personId,
            },
            data: goal,
        });
        return updatedGoal;
    }
    async updateExecuteGoal(goalId, personId) {
        await prisma_1.prisma.goal.update({
            where: {
                id: goalId,
                userPersonId: personId,
            },
            data: {
                isExecuted: true,
            },
        });
    }
    async updateInactivateOldGoal(goalId, personId) {
        await prisma_1.prisma.goal.update({
            where: {
                id: goalId,
                userPersonId: personId,
            },
            data: {
                isExpire: true,
            },
        });
    }
    async addCounter(goalId, personId) {
        const goal = await prisma_1.prisma.goal.update({
            where: {
                id: goalId,
                userPersonId: personId,
            },
            data: {
                counter: {
                    increment: 1,
                },
            },
        });
        return goal;
    }
    async getCountExecutedGoals(personId) {
        const countedExecutedGoals = await prisma_1.prisma.goal.count({
            where: {
                userPersonId: personId,
                isExecuted: true,
            },
        });
        return countedExecutedGoals;
    }
}
exports.PrismaGoalRepository = PrismaGoalRepository;
