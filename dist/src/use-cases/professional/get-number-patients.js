"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetNumberPatientsUseCase = void 0;
const person_not_found_1 = require("@/errors/person-not-found");
class GetNumberPatientsUseCase {
    schedulingRepository;
    professionalRepository;
    constructor(schedulingRepository, professionalRepository) {
        this.schedulingRepository = schedulingRepository;
        this.professionalRepository = professionalRepository;
    }
    async execute({ professionalId, }) {
        const professional = await this.professionalRepository.getById(professionalId);
        if (!professional) {
            throw new person_not_found_1.PersonNotFoundError();
        }
        const numberPatients = await this.schedulingRepository.getPatientsByProfessionalId(professionalId);
        return { numberPatients: numberPatients ?? 0 };
    }
}
exports.GetNumberPatientsUseCase = GetNumberPatientsUseCase;
