"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getById = void 0;
const resource_not_found_error_1 = require("@/errors/resource-not-found-error");
const make_get_by_id_professional_use_case_1 = require("@/factories/professional/make-get-by-id-professional-use-case");
const v4_1 = require("zod/v4");
const getById = async (app) => {
    app.get('/professional/:professionalId', {
        schema: {
            tags: ['Professional'],
            params: v4_1.z.object({
                professionalId: v4_1.z.string(),
            }),
            response: {
                200: v4_1.z.object({
                    professional: v4_1.z.object({
                        id: v4_1.z.uuid(),
                        name: v4_1.z.string(),
                        email: v4_1.z.string(),
                        phone: v4_1.z.string(),
                        address: v4_1.z.string(),
                        neighborhood: v4_1.z.string(),
                        city: v4_1.z.string(),
                        uf: v4_1.z.string(),
                    }),
                }),
                400: v4_1.z.object({
                    message: v4_1.z.string(),
                }),
            },
        },
    }, async (request, reply) => {
        const { professionalId } = request.params;
        const getByIdProfessionalUseCase = (0, make_get_by_id_professional_use_case_1.makeGetByIdProfessionalUseCase)();
        try {
            const { professional } = await getByIdProfessionalUseCase.execute({
                professionalId,
            });
            return reply.status(200).send({ professional });
        }
        catch (err) {
            if (err instanceof resource_not_found_error_1.ResourceNotFoundError) {
                return reply.status(400).send({
                    message: err.message,
                });
            }
        }
    });
};
exports.getById = getById;
