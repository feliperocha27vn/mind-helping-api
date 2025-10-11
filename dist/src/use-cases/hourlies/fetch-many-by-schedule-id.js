"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchManyHourliesByScheduleIdUseCase = void 0;
const resource_not_found_error_1 = require("@/errors/resource-not-found-error");
class FetchManyHourliesByScheduleIdUseCase {
    hourlyRepository;
    scheduleRepository;
    constructor(hourlyRepository, scheduleRepository) {
        this.hourlyRepository = hourlyRepository;
        this.scheduleRepository = scheduleRepository;
    }
    async execute({ scheduleId, }) {
        const schedule = await this.scheduleRepository.getById(scheduleId);
        if (!schedule) {
            throw new resource_not_found_error_1.ResourceNotFoundError();
        }
        const hourlies = await this.hourlyRepository.fetchManyByScheduleId(scheduleId);
        return { hourlies };
    }
}
exports.FetchManyHourliesByScheduleIdUseCase = FetchManyHourliesByScheduleIdUseCase;
