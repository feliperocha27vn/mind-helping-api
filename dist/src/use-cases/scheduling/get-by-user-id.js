"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSchedulingUseCase = void 0;
const resource_not_found_error_1 = require("@/errors/resource-not-found-error");
class GetSchedulingUseCase {
    schedulingRepository;
    personRepository;
    hourlyRepository;
    constructor(schedulingRepository, personRepository, hourlyRepository) {
        this.schedulingRepository = schedulingRepository;
        this.personRepository = personRepository;
        this.hourlyRepository = hourlyRepository;
    }
    async execute({ userId, }) {
        const scheduling = await this.schedulingRepository.getByUserId(userId);
        if (!scheduling) {
            throw new resource_not_found_error_1.ResourceNotFoundError();
        }
        const professional = await this.personRepository.findById(scheduling.professionalPersonId);
        if (!professional) {
            throw new resource_not_found_error_1.ResourceNotFoundError();
        }
        const hourly = await this.hourlyRepository.getById(scheduling.hourlyId);
        if (!hourly) {
            throw new resource_not_found_error_1.ResourceNotFoundError();
        }
        const schedulingDetails = {
            id: scheduling.id,
            nameProfessional: professional.name,
            phoneProfessional: professional.phone,
            emailProfessional: professional.email,
            date: hourly.date,
            hour: hourly.hour,
            address: {
                street: professional.address,
                neighborhood: professional.neighborhood,
                complement: professional.complement,
                cep: professional.cep,
                city: professional.city,
                uf: professional.uf,
            },
        };
        return { schedulingDetails };
    }
}
exports.GetSchedulingUseCase = GetSchedulingUseCase;
