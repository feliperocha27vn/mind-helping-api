"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryHourlyRepository = void 0;
const date_fns_1 = require("date-fns");
const node_crypto_1 = require("node:crypto");
class InMemoryHourlyRepository {
    items = [];
    async createMany(data) {
        const hourlies = data.map(item => {
            const hourly = {
                id: item.id ?? (0, node_crypto_1.randomUUID)(),
                scheduleId: item.scheduleId,
                date: new Date(item.date ?? new Date()),
                hour: item.hour,
                isOcuped: item.isOcuped ?? false,
            };
            this.items.push(hourly);
            return hourly;
        });
        return hourlies;
    }
    async fetchManyByScheduleId(scheduleId) {
        const hourlies = this.items.filter(item => item.scheduleId === scheduleId);
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
        return this.createMany(slotsData);
    }
    async getHourlyByDateAndHour(date, hour) {
        const hourly = this.items.find(item => item.date.getTime() === date.getTime() && item.hour === hour);
        if (!hourly) {
            return null;
        }
        return hourly;
    }
    async updateStatusOcuped(hourlyId) {
        const hourly = this.items.find(item => item.id === hourlyId);
        if (!hourly) {
            return null;
        }
        hourly.isOcuped = true;
        return hourly;
    }
    async getById(id) {
        const hourly = this.items.find(item => item.id === id) || null;
        return hourly;
    }
}
exports.InMemoryHourlyRepository = InMemoryHourlyRepository;
