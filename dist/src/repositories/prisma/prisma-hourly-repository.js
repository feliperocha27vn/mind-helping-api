"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaHourlyRepository = void 0;
const prisma_1 = require("@/lib/prisma");
const date_fns_1 = require("date-fns");
const node_crypto_1 = require("node:crypto");
class PrismaHourlyRepository {
    async createMany(data) {
        await prisma_1.prisma.hourly.createMany({
            data,
        });
        // Coleta todos os scheduleIds únicos do array de dados
        const scheduleIds = [...new Set(data.map(item => item.scheduleId))];
        const hourlies = await prisma_1.prisma.hourly.findMany({
            where: {
                scheduleId: {
                    in: scheduleIds,
                },
            },
        });
        return hourlies;
    }
    async createHourlySlots(scheduleId, initialTime, endTime, interval) {
        const slotsData = [];
        let currentTime = new Date(initialTime);
        while ((0, date_fns_1.isBefore)(currentTime, endTime)) {
            // Extrai a hora em UTC para manter consistência
            const hourUTC = currentTime.getUTCHours().toString().padStart(2, '0');
            const minuteUTC = currentTime.getUTCMinutes().toString().padStart(2, '0');
            slotsData.push({
                id: (0, node_crypto_1.randomUUID)(),
                isOcuped: false,
                date: new Date(currentTime),
                hour: `${hourUTC}:${minuteUTC}`,
                scheduleId,
            });
            currentTime = (0, date_fns_1.addMinutes)(currentTime, interval);
        }
        await this.createMany(slotsData);
        // Busca apenas os horários do scheduleId específico
        const hourlies = await prisma_1.prisma.hourly.findMany({
            where: {
                scheduleId,
            },
        });
        return hourlies;
    }
    async fetchManyByScheduleId(scheduleId) {
        const hourlies = await prisma_1.prisma.hourly.findMany({
            where: {
                scheduleId,
            },
        });
        return hourlies;
    }
    async getHourlyByDateAndHour(date, hour) {
        const hourly = await prisma_1.prisma.hourly.findFirst({
            where: {
                date,
                hour,
            },
        });
        return hourly;
    }
    async updateStatusOcuped(hourlyId) {
        const hourly = await prisma_1.prisma.hourly.update({
            where: {
                id: hourlyId,
            },
            data: {
                isOcuped: true,
            },
        });
        return hourly;
    }
    async getById(id) {
        const hourly = await prisma_1.prisma.hourly.findUnique({
            where: {
                id,
            },
        });
        return hourly;
    }
}
exports.PrismaHourlyRepository = PrismaHourlyRepository;
