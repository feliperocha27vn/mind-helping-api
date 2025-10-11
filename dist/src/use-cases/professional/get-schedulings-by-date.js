"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSchedulingsByDateUseCase = void 0;
const date_not_valid_1 = require("@/errors/date-not-valid");
const person_not_found_1 = require("@/errors/person-not-found");
const validate_date_time_1 = require("@/utils/validate-date-time");
class GetSchedulingsByDateUseCase {
    schedulingRepository;
    professionalRepository;
    constructor(schedulingRepository, professionalRepository) {
        this.schedulingRepository = schedulingRepository;
        this.professionalRepository = professionalRepository;
    }
    async execute({ professionalId, startDay, endDay, }) {
        const professional = await this.professionalRepository.getById(professionalId);
        if (!professional) {
            throw new person_not_found_1.PersonNotFoundError();
        }
        // Regra de negócio: validar e normalizar as datas para UTC
        // Extrai a data inicial em UTC para evitar problemas de timezone
        const startYear = startDay.getUTCFullYear();
        const startMonth = String(startDay.getUTCMonth() + 1).padStart(2, '0');
        const startDayOfMonth = String(startDay.getUTCDate()).padStart(2, '0');
        const startDayStr = `${startYear}-${startMonth}-${startDayOfMonth}`;
        const normalizedStartDate = (0, validate_date_time_1.validateDateTime)(startDayStr, '00:00');
        if (!normalizedStartDate.isValid || !normalizedStartDate.dateTimeObj) {
            throw new date_not_valid_1.DateNotValidError();
        }
        // Extrai a data final em UTC
        const endYear = endDay.getUTCFullYear();
        const endMonth = String(endDay.getUTCMonth() + 1).padStart(2, '0');
        const endDayOfMonth = String(endDay.getUTCDate()).padStart(2, '0');
        const endDayStr = `${endYear}-${endMonth}-${endDayOfMonth}`;
        const normalizedEndDate = (0, validate_date_time_1.validateDateTime)(endDayStr, '23:59');
        if (!normalizedEndDate.isValid || !normalizedEndDate.dateTimeObj) {
            throw new date_not_valid_1.DateNotValidError();
        }
        // Passa as datas normalizadas em UTC para o repositório
        const schedulingsCount = await this.schedulingRepository.getSchedulingsByDate(professionalId, normalizedStartDate.dateTimeObj, normalizedEndDate.dateTimeObj);
        return {
            schedulingsCount,
        };
    }
}
exports.GetSchedulingsByDateUseCase = GetSchedulingsByDateUseCase;
