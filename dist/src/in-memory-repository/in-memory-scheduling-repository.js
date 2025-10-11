"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemorySchedulingRepository = void 0;
const date_fns_1 = require("date-fns");
const node_crypto_1 = require("node:crypto");
class InMemorySchedulingRepository {
    items = [];
    async create(data) {
        const scheduling = {
            id: data.id ?? (0, node_crypto_1.randomUUID)(),
            hourlyId: data.hourlyId,
            professionalPersonId: data.professionalPersonId,
            userPersonId: data.userPersonId,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.items.push(scheduling);
        return scheduling;
    }
    async getByUserId(userId) {
        const schedulings = this.items.filter(item => item.userPersonId === userId);
        const scheduling = schedulings[schedulings.length - 1] ?? null;
        if (!scheduling) {
            return null;
        }
        return scheduling;
    }
    async getPatientsByProfessionalId(professionalId) {
        const schedulings = this.items.filter(item => item.professionalPersonId === professionalId);
        if (schedulings.length === 0) {
            return null;
        }
        const numberUniquePatients = new Set(schedulings.map(item => item.userPersonId)).size;
        return numberUniquePatients;
    }
    async getSchedulingsByDate(professionalId, startDay, endDay) {
        const schedulingsByDate = this.items.filter(item => {
            const professionalMatch = item.professionalPersonId === professionalId;
            const dateInRange = (0, date_fns_1.isWithinInterval)(item.createdAt, {
                start: startDay,
                end: endDay,
            });
            return professionalMatch && dateInRange;
        });
        const schedulingsCount = schedulingsByDate.length;
        if (schedulingsCount === 0) {
            return null;
        }
        return schedulingsCount;
    }
}
exports.InMemorySchedulingRepository = InMemorySchedulingRepository;
