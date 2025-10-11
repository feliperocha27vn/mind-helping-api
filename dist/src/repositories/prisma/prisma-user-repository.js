"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepository = void 0;
const prisma_1 = require("@/lib/prisma");
class PrismaUserRepository {
    async create(data) {
        const user = await prisma_1.prisma.user.create({
            data,
        });
        return user;
    }
    async getById(personId) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { person_id: personId },
        });
        return user;
    }
}
exports.PrismaUserRepository = PrismaUserRepository;
