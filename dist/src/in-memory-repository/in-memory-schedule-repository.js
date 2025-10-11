"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryScheduleRepository = void 0;
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
class InMemoryScheduleRepository {
    items = [];
    async create(data) {
        const schedule = {
            id: data.id ?? (0, crypto_1.randomUUID)(),
            professionalPersonId: data.professionalPersonId ?? (0, crypto_1.randomUUID)(),
            initialTime: new Date(data.initialTime ?? new Date()),
            endTime: new Date(data.endTime ?? new Date()),
            interval: data.interval,
            cancellationPolicy: data.cancellationPolicy,
            averageValue: new client_1.Prisma.Decimal(data.averageValue.toString()),
            observation: data.observation ?? '',
            isControlled: data.isControlled,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.items.push(schedule);
        return schedule;
    }
    async getById(id) {
        const schedule = this.items.find(item => item.id === id);
        if (!schedule) {
            return null;
        }
        return schedule;
    }
    async fetchMany(professionalPersonId) {
        const schedules = this.items.filter(item => item.professionalPersonId === professionalPersonId);
        if (!schedules) {
            return null;
        }
        return schedules;
    }
}
exports.InMemoryScheduleRepository = InMemoryScheduleRepository;
