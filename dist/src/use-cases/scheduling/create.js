"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSchedulingUseCase = void 0;
const date_not_valid_1 = require("@/errors/date-not-valid");
const invalid_parameters_1 = require("@/errors/invalid-parameters");
const person_not_found_1 = require("@/errors/person-not-found");
const resource_not_found_error_1 = require("@/errors/resource-not-found-error");
const validate_date_time_1 = require("@/utils/validate-date-time");
class CreateSchedulingUseCase {
    scheduleRepository;
    schedulingRepository;
    hourlyRepository;
    professionalRepository;
    userRepository;
    constructor(scheduleRepository, schedulingRepository, hourlyRepository, professionalRepository, userRepository) {
        this.scheduleRepository = scheduleRepository;
        this.schedulingRepository = schedulingRepository;
        this.hourlyRepository = hourlyRepository;
        this.professionalRepository = professionalRepository;
        this.userRepository = userRepository;
    }
    async execute({ date, hour, scheduleId, professionalPersonId, userPersonId, }) {
        const professional = await this.professionalRepository.getById(professionalPersonId);
        if (!professional) {
            throw new person_not_found_1.PersonNotFoundError();
        }
        const user = await this.userRepository.getById(userPersonId);
        if (!user) {
            throw new person_not_found_1.PersonNotFoundError();
        }
        const schedule = await this.scheduleRepository.getById(scheduleId);
        if (!schedule) {
            throw new resource_not_found_error_1.ResourceNotFoundError();
        }
        // Valida e normaliza a data e hora
        const validation = (0, validate_date_time_1.validateDateTime)(date, hour);
        if (!validation.isValid || !validation.dateTimeObj) {
            throw new invalid_parameters_1.InvalidParametersError();
        }
        const { dateTimeObj } = validation;
        const hourly = await this.hourlyRepository.getHourlyByDateAndHour(dateTimeObj, hour);
        if (!hourly) {
            throw new resource_not_found_error_1.ResourceNotFoundError();
        }
        if (hourly.date < new Date()) {
            throw new date_not_valid_1.DateNotValidError();
        }
        const scheduling = await this.schedulingRepository.create({
            hourlyId: hourly.id,
            professionalPersonId,
            userPersonId,
        });
        await this.hourlyRepository.updateStatusOcuped(hourly.id);
        return { scheduling };
    }
}
exports.CreateSchedulingUseCase = CreateSchedulingUseCase;
