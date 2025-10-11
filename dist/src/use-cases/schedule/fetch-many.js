"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchManySchedulesUseCase = void 0;
const not_existing_schedules_1 = require("@/errors/not-existing-schedules");
const person_not_found_1 = require("@/errors/person-not-found");
class FetchManySchedulesUseCase {
    scheduleRepository;
    professionalRepository;
    constructor(scheduleRepository, professionalRepository) {
        this.scheduleRepository = scheduleRepository;
        this.professionalRepository = professionalRepository;
    }
    async execute({ professionalId, }) {
        const professional = await this.professionalRepository.getById(professionalId);
        if (!professional) {
            throw new person_not_found_1.PersonNotFoundError();
        }
        const schedules = await this.scheduleRepository.fetchMany(professionalId);
        if (!schedules) {
            throw new not_existing_schedules_1.NotExistingSchedulesError();
        }
        if (schedules.length === 0) {
            throw new not_existing_schedules_1.NotExistingSchedulesError();
        }
        return { schedules };
    }
}
exports.FetchManySchedulesUseCase = FetchManySchedulesUseCase;
