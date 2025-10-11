"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHourlies = createHourlies;
const prisma_1 = require("@/lib/prisma");
const date_fns_1 = require("date-fns");
const node_crypto_1 = require("node:crypto");
async function createHourlies(scheduleId, initialTime, endTime, interval) {
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
    await prisma_1.prisma.hourly.createMany({
        data: slotsData,
    });
    const hourlies = await prisma_1.prisma.hourly.findMany({
        where: {
            scheduleId,
        },
    });
    return { hourlies };
}
