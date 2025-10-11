"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaProfessionalRepository = void 0;
const prisma_1 = require("../../lib/prisma");
class PrismaProfessionalRepository {
    async create(data) {
        const professional = await prisma_1.prisma.professional.create({
            data,
        });
        return professional;
    }
    async fetchMany(search) {
        const professionals = await prisma_1.prisma.$queryRaw `
      SELECT person.name, person.email, person.phone, person.address, person.neighborhood, person.city, person.uf, person.id
      FROM professionals
      LEFT JOIN person ON professionals.person_id = person.id
      WHERE person.name ILIKE '%' || ${search} || '%'
    `;
        return professionals;
    }
    async getById(professionalId) {
        const professional = await prisma_1.prisma.professional.findUnique({
            where: {
                person_id: professionalId,
            },
            include: {
                person: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        address: true,
                        neighborhood: true,
                        city: true,
                        uf: true,
                    },
                },
            },
        });
        if (!professional || !professional.person) {
            return null;
        }
        // Mapear para o formato esperado
        return {
            id: professional.person.id,
            name: professional.person.name,
            email: professional.person.email,
            phone: professional.person.phone,
            address: professional.person.address,
            neighborhood: professional.person.neighborhood,
            city: professional.person.city,
            uf: professional.person.uf,
            voluntary: professional.voluntary,
        };
    }
}
exports.PrismaProfessionalRepository = PrismaProfessionalRepository;
