"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaPersonRepository = void 0;
const prisma_1 = require("../../lib/prisma");
class PrismaPersonRepository {
    async create(data) {
        const person = await prisma_1.prisma.person.create({
            data,
        });
        return person;
    }
    async findById(personId) {
        const person = await prisma_1.prisma.person.findUnique({
            where: {
                id: personId,
            },
        });
        return person;
    }
    async findByEmail(email) {
        const person = await prisma_1.prisma.person.findUnique({
            where: {
                email,
            },
        });
        return person;
    }
}
exports.PrismaPersonRepository = PrismaPersonRepository;
