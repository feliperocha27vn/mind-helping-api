"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMany = void 0;
const make_fetch_many_professionals_use_case_1 = require("@/factories/professional/make-fetch-many-professionals-use-case");
const v4_1 = require("zod/v4");
const fetchMany = async (app) => {
    app.get('/professionals', {
        schema: {
            tags: ['Professional'],
            querystring: v4_1.z.object({
                search: v4_1.z.string(),
            }),
            response: {
                200: v4_1.z.object({
                    professionals: v4_1.z.array(v4_1.z.object({
                        id: v4_1.z.uuid(),
                        name: v4_1.z.string(),
                        email: v4_1.z.string(),
                        phone: v4_1.z.string(),
                        address: v4_1.z.string(),
                        neighborhood: v4_1.z.string(),
                        city: v4_1.z.string(),
                        uf: v4_1.z.string(),
                    })),
                }),
                400: v4_1.z.object({
                    message: v4_1.z.string(),
                }),
            },
        },
    }, async (request, reply) => {
        const { search } = request.query;
        const fetchManyProfessionalsUseCase = (0, make_fetch_many_professionals_use_case_1.makeFetchManyProfessionalsUseCase)();
        try {
            const { professionals } = await fetchManyProfessionalsUseCase.execute({
                search,
            });
            return reply.status(200).send({ professionals });
        }
        catch (err) {
            if (err instanceof Error) {
                return reply.status(400).send({
                    message: err.message,
                });
            }
        }
    });
};
exports.fetchMany = fetchMany;
