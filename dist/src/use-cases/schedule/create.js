"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateScheduleUseCase = void 0;
const date_not_valid_1 = require("@/errors/date-not-valid");
const person_not_found_1 = require("@/errors/person-not-found");
const date_fns_1 = require("date-fns");
class CreateScheduleUseCase {
    scheduleRepository;
    hourlyRepository;
    professionalRepository;
    constructor(scheduleRepository, hourlyRepository, professionalRepository) {
        this.scheduleRepository = scheduleRepository;
        this.hourlyRepository = hourlyRepository;
        this.professionalRepository = professionalRepository;
    }
    async execute({ professionalPersonId, schedules, }) {
        const professionalPerson = await this.professionalRepository.getById(professionalPersonId);
        if (!professionalPerson) {
            throw new person_not_found_1.PersonNotFoundError();
        }
        const createdSchedules = await Promise.all(schedules.map(async (scheduleItem) => {
            const { initialTime, endTime, interval, cancellationPolicy, averageValue, observation, isControlled, } = scheduleItem;
            const finalAverageValue = professionalPerson.voluntary
                ? 0
                : averageValue;
            const schedule = await this.scheduleRepository.create({
                professionalPersonId,
                averageValue: finalAverageValue,
                cancellationPolicy,
                observation,
                interval,
                isControlled,
                initialTime,
                endTime,
            });
            if (scheduleItem.initialTime < new Date()) {
                throw new date_not_valid_1.DateNotValidError();
            }
            if (schedule.isControlled) {
                const dateIsValid = (0, date_fns_1.isValid)(scheduleItem.initialTime) && (0, date_fns_1.isValid)(scheduleItem.endTime);
                if (!dateIsValid) {
                    throw new date_not_valid_1.DateNotValidError();
                }
                // Cria os horários usando as datas originais (já estão em UTC)
                await this.hourlyRepository.createHourlySlots(schedule.id, initialTime, endTime, scheduleItem.interval);
            }
            return schedule;
        }));
        return { schedule: createdSchedules };
    }
}
exports.CreateScheduleUseCase = CreateScheduleUseCase;
