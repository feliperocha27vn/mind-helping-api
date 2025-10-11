"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
const prisma_1 = require("@/lib/prisma");
const bcryptjs_1 = require("bcryptjs");
async function createUser() {
    const person = await prisma_1.prisma.person.create({
        data: {
            name: 'Roberto Silva',
            birth_date: new Date('1992-08-25'),
            cpf: '123.456.789-00',
            address: 'Avenida Brasil',
            neighborhood: 'Centro',
            number: 1500,
            complement: 'Sala 32',
            cep: '16200-001',
            city: 'Birigui',
            uf: 'SP',
            phone: '(18) 99123-4567',
            email: 'roberto.silva@example.com',
            password_hash: await (0, bcryptjs_1.hash)('hashed-password', 6),
        },
    });
    const user = await prisma_1.prisma.user.create({
        data: {
            gender: 'female',
            person_id: person.id,
        },
    });
    return { user };
}
