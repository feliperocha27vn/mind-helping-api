"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterProfessionalUseCase = void 0;
const resource_not_found_error_1 = require("@/errors/resource-not-found-error");
class RegisterProfessionalUseCase {
    registerProfessionalRepository;
    registerPersonRepository;
    constructor(registerProfessionalRepository, registerPersonRepository) {
        this.registerProfessionalRepository = registerProfessionalRepository;
        this.registerPersonRepository = registerPersonRepository;
    }
    async execute({ person_id, crp, voluntary, }) {
        const person = await this.registerPersonRepository.findById(person_id);
        if (!person) {
            throw new resource_not_found_error_1.ResourceNotFoundError();
        }
        const professional = await this.registerProfessionalRepository.create({
            person_id: person.id,
            crp,
            voluntary,
        });
        return {
            professional,
        };
    }
}
exports.RegisterProfessionalUseCase = RegisterProfessionalUseCase;
