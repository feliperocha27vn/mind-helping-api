"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFeelingsByDateUseCase = void 0;
const date_not_valid_1 = require("@/errors/date-not-valid");
const person_not_found_1 = require("@/errors/person-not-found");
const validate_date_time_1 = require("@/utils/validate-date-time");
class GetFeelingsByDateUseCase {
    personRepository;
    userRepository;
    feelingsRepository;
    constructor(personRepository, userRepository, feelingsRepository) {
        this.personRepository = personRepository;
        this.userRepository = userRepository;
        this.feelingsRepository = feelingsRepository;
    }
    async execute({ userId, day, startDay, endDay, }) {
        const person = await this.personRepository.findById(userId);
        if (!person) {
            throw new person_not_found_1.PersonNotFoundError();
        }
        const user = await this.userRepository.getById(person.id);
        if (!user) {
            throw new person_not_found_1.PersonNotFoundError();
        }
        // Se 'day' for fornecido, usa como startDay e endDay (backward compatibility)
        // Caso contrário, usa startDay e endDay fornecidos explicitamente
        const actualStartDay = day || startDay;
        const actualEndDay = day || endDay;
        if (!actualStartDay || !actualEndDay) {
            throw new date_not_valid_1.DateNotValidError();
        }
        // Regra de negócio: validar e normalizar as datas para UTC
        // Extrai a data inicial em UTC para evitar problemas de timezone
        const startYear = actualStartDay.getUTCFullYear();
        const startMonth = String(actualStartDay.getUTCMonth() + 1).padStart(2, '0');
        const startDayOfMonth = String(actualStartDay.getUTCDate()).padStart(2, '0');
        const startDayStr = `${startYear}-${startMonth}-${startDayOfMonth}`;
        const normalizedStartDate = (0, validate_date_time_1.validateDateTime)(startDayStr, '00:00');
        if (!normalizedStartDate.isValid || !normalizedStartDate.dateTimeObj) {
            throw new date_not_valid_1.DateNotValidError();
        }
        // Extrai a data final em UTC
        const endYear = actualEndDay.getUTCFullYear();
        const endMonth = String(actualEndDay.getUTCMonth() + 1).padStart(2, '0');
        const endDayOfMonth = String(actualEndDay.getUTCDate()).padStart(2, '0');
        const endDayStr = `${endYear}-${endMonth}-${endDayOfMonth}`;
        const normalizedEndDate = (0, validate_date_time_1.validateDateTime)(endDayStr, '23:59');
        if (!normalizedEndDate.isValid || !normalizedEndDate.dateTimeObj) {
            throw new date_not_valid_1.DateNotValidError();
        }
        // Passa as datas normalizadas em UTC para o repositório
        const feelings = await this.feelingsRepository.getFeelingsByDate(userId, normalizedStartDate.dateTimeObj, normalizedEndDate.dateTimeObj);
        return {
            feelings,
        };
    }
}
exports.GetFeelingsByDateUseCase = GetFeelingsByDateUseCase;
