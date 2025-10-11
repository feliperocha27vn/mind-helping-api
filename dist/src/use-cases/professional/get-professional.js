"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProfessionalByIdUseCase = void 0;
const resource_not_found_error_1 = require("@/errors/resource-not-found-error");
class GetProfessionalByIdUseCase {
    professionalRepository;
    constructor(professionalRepository) {
        this.professionalRepository = professionalRepository;
    }
    async execute({ professionalId, }) {
        const professional = await this.professionalRepository.getById(professionalId);
        if (!professional) {
            throw new resource_not_found_error_1.ResourceNotFoundError();
        }
        return { professional };
    }
}
exports.GetProfessionalByIdUseCase = GetProfessionalByIdUseCase;
