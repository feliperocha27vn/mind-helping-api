"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerProfessional = void 0;
const v4_1 = require("zod/v4");
const invalid_parameters_1 = require("../../../errors/invalid-parameters");
const resource_not_found_error_1 = require("../../../errors/resource-not-found-error");
const make_register_person_use_case_1 = require("../../../factories/person/make-register-person-use-case");
const make_register_professional_use_case_1 = require("../../../factories/person/make-register-professional-use-case");
const registerProfessional = async (app) => {
    app.post('/professional', {
        schema: {
            tags: ['Professional'],
            body: v4_1.z.object({
                name: v4_1.z.string(),
                birth_date: v4_1.z.coerce.date(),
                cpf: v4_1.z.string(),
                address: v4_1.z.string(),
                neighborhood: v4_1.z.string(),
                number: v4_1.z.number(),
                complement: v4_1.z.string(),
                cepUser: v4_1.z.string(),
                city: v4_1.z.string(),
                uf: v4_1.z.string(),
                phone: v4_1.z.string(),
                email: v4_1.z.email(),
                password: v4_1.z.string(),
                crp: v4_1.z.string(),
                voluntary: v4_1.z.boolean(),
            }),
            response: {
                201: v4_1.z.object({
                    professional: v4_1.z.object({
                        person_id: v4_1.z.string(),
                        crp: v4_1.z.string(),
                        voluntary: v4_1.z.boolean(),
                    }),
                }),
                409: v4_1.z.object({
                    message: v4_1.z.string(),
                }),
            },
        },
    }, async (request, reply) => {
        const { name, birth_date, cpf, address, neighborhood, number, complement, cepUser, city, uf, phone, email, password, crp, voluntary, } = request.body;
        const registerPersonUseCase = (0, make_register_person_use_case_1.makePersonUseCase)();
        const { person } = await registerPersonUseCase.execute({
            name,
            birth_date,
            cpf,
            cepUser,
            address,
            neighborhood,
            number,
            complement,
            city,
            uf,
            phone,
            email,
            password,
        });
        const professionalUseCase = (0, make_register_professional_use_case_1.makeRegisterProfessionalUseCase)();
        try {
            const { professional } = await professionalUseCase.execute({
                person_id: person.id,
                crp,
                voluntary,
            });
            return reply.status(201).send({ professional });
        }
        catch (err) {
            if (err instanceof resource_not_found_error_1.ResourceNotFoundError) {
                return reply.status(409).send({ message: 'Resource not found' });
            }
            if (err instanceof invalid_parameters_1.InvalidParametersError) {
                return reply.status(409).send({ message: 'Invalid parameters' });
            }
            return reply.status(409).send({ message: 'Unknown error' });
        }
    });
};
exports.registerProfessional = registerProfessional;
