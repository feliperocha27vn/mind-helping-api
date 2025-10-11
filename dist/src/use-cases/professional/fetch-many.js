"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchManyProfessionalsUseCase = void 0;
class FetchManyProfessionalsUseCase {
    professionalRepository;
    constructor(professionalRepository) {
        this.professionalRepository = professionalRepository;
    }
    async execute({ search }) {
        const professionals = await this.professionalRepository.fetchMany(search);
        return { professionals };
    }
}
exports.FetchManyProfessionalsUseCase = FetchManyProfessionalsUseCase;
