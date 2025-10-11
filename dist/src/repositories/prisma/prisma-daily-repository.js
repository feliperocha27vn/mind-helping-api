"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaDailyRepository = void 0;
const prisma_1 = require("@/lib/prisma");
class PrismaDailyRepository {
    async create(data) {
        const daily = await prisma_1.prisma.daily.create({
            data,
        });
        return daily;
    }
}
exports.PrismaDailyRepository = PrismaDailyRepository;
