"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/app.ts
var import_cors = __toESM(require("@fastify/cors"));
var import_swagger = __toESM(require("@fastify/swagger"));
var import_swagger_ui = __toESM(require("@fastify/swagger-ui"));
var import_fastify = __toESM(require("fastify"));
var import_fastify_type_provider_zod = require("fastify-type-provider-zod");

// src/errors/resource-not-found-error.ts
var ResourceNotFoundError = class extends Error {
  constructor() {
    super("Resource not found");
  }
};

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/repositories/prisma/prisma-feelings-repository.ts
var PrismaFeelingsRepository = class {
  async create(data) {
    const feeling = await prisma.feelingsUser.create({
      data
    });
    return feeling;
  }
  async getLastFeelingsByUserId(userId) {
    const feeling = await prisma.feelingsUser.findFirst({
      where: {
        userPersonId: userId
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return feeling;
  }
  async getFeelingsByDate(userId, startDay, endDay) {
    const feelings = await prisma.feelingsUser.findMany({
      where: {
        userPersonId: userId,
        createdAt: {
          gte: startDay,
          lte: endDay
        }
      },
      orderBy: {
        createdAt: "asc"
      }
    });
    return feelings;
  }
};

// src/repositories/prisma/prisma-person-repository.ts
var PrismaPersonRepository = class {
  async create(data) {
    const person = await prisma.person.create({
      data
    });
    return person;
  }
  async findById(personId) {
    const person = await prisma.person.findUnique({
      where: {
        id: personId
      }
    });
    return person;
  }
  async findByEmail(email) {
    const person = await prisma.person.findUnique({
      where: {
        email
      }
    });
    return person;
  }
};

// src/use-cases/feelings-user/create.ts
var CreateFeelingUserUseCase = class {
  constructor(feelingsRepository, personRepository) {
    this.feelingsRepository = feelingsRepository;
    this.personRepository = personRepository;
  }
  async execute({
    description,
    motive,
    userPersonId
  }) {
    const personUser = await this.personRepository.findById(userPersonId);
    if (!personUser) {
      throw new ResourceNotFoundError();
    }
    const feelingsUser = await this.feelingsRepository.create({
      description,
      motive,
      userPersonId
    });
    return { feelingsUser };
  }
};

// src/factories/feelings-user/make-create-feeling-user-use-case.ts
function makeCreateFeelingUserUseCase() {
  const prismaFeelingsRepository = new PrismaFeelingsRepository();
  const prismaPersonRepository = new PrismaPersonRepository();
  const createFeelingUserUseCase = new CreateFeelingUserUseCase(
    prismaFeelingsRepository,
    prismaPersonRepository
  );
  return createFeelingUserUseCase;
}

// src/http/controllers/feelings-user/create.ts
var import_zod = __toESM(require("zod"));
var createFeelingsUser = async (app2) => {
  app2.post(
    "/feelings/:userId",
    {
      schema: {
        tags: ["Feelings"],
        params: import_zod.default.object({
          userId: import_zod.default.uuid()
        }),
        body: import_zod.default.object({
          description: import_zod.default.enum([
            "TRISTE",
            "ANSIOSO",
            "TEDIO",
            "RAIVA",
            "N\xC3O_SEI_DIZER",
            "FELIZ"
          ]),
          motive: import_zod.default.string().nullable().optional()
        }),
        response: {
          201: import_zod.default.void(),
          404: import_zod.default.object({ message: import_zod.default.string() }),
          500: import_zod.default.object({ message: import_zod.default.string() })
        }
      }
    },
    async (request, reply) => {
      const { userId } = request.params;
      const { description, motive } = request.body;
      const createFeelingUserUseCase = makeCreateFeelingUserUseCase();
      try {
        await createFeelingUserUseCase.execute({
          userPersonId: userId,
          description,
          motive
        });
        return reply.status(201).send();
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }
        return reply.status(500).send({ message: "Internal server error." });
      }
    }
  );
};

// src/errors/date-not-valid.ts
var DateNotValidError = class extends Error {
  constructor() {
    super("Date is not valid");
  }
};

// src/errors/person-not-found.ts
var PersonNotFoundError = class extends Error {
  constructor() {
    super("Person not found");
  }
};

// src/repositories/prisma/prisma-user-repository.ts
var PrismaUserRepository = class {
  async create(data) {
    const user = await prisma.user.create({
      data
    });
    return user;
  }
  async getById(personId) {
    const user = await prisma.user.findUnique({
      where: { person_id: personId }
    });
    return user;
  }
};

// src/utils/validate-date-time.ts
var import_date_fns = require("date-fns");
function validateDateTime(date, hour) {
  let dateObj;
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(date)) {
    dateObj = new Date(date);
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    dateObj = (0, import_date_fns.parseISO)(date);
  } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
    dateObj = (0, import_date_fns.parse)(date, "dd/MM/yyyy", /* @__PURE__ */ new Date());
  } else if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
    dateObj = (0, import_date_fns.parse)(date, "MM-dd-yyyy", /* @__PURE__ */ new Date());
  } else if (/^\d+$/.test(date)) {
    dateObj = new Date(Number.parseInt(date));
  } else {
    return {
      isValid: false,
      error: "Invalid date format. Expected: YYYY-MM-DD, DD/MM/YYYY, MM-DD-YYYY, ISO 8601, or Unix timestamp"
    };
  }
  if (!(0, import_date_fns.isValid)(dateObj)) {
    return {
      isValid: false,
      error: "Invalid date. Please check the date values."
    };
  }
  const hourNormalized = hour.substring(0, 5);
  if (!/^\d{2}:\d{2}$/.test(hourNormalized)) {
    return {
      isValid: false,
      error: "Invalid hour format. Expected HH:mm (24-hour format)"
    };
  }
  const [hourValue, minuteValue] = hourNormalized.split(":").map(Number);
  if (hourValue < 0 || hourValue > 23 || minuteValue < 0 || minuteValue > 59) {
    return {
      isValid: false,
      error: "Invalid hour values. Hour must be 00-23 and minutes 00-59"
    };
  }
  const year = dateObj.getUTCFullYear();
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getUTCDate()).padStart(2, "0");
  const dateTimeString = `${year}-${month}-${day}T${hourNormalized}:00.000Z`;
  const dateTimeObj = new Date(dateTimeString);
  return {
    isValid: true,
    dateTimeString,
    dateTimeObj
  };
}

// src/use-cases/feelings-user/get-feelings-by-date.ts
var GetFeelingsByDateUseCase = class {
  constructor(personRepository, userRepository, feelingsRepository) {
    this.personRepository = personRepository;
    this.userRepository = userRepository;
    this.feelingsRepository = feelingsRepository;
  }
  async execute({
    userId,
    day,
    startDay,
    endDay
  }) {
    const person = await this.personRepository.findById(userId);
    if (!person) {
      throw new PersonNotFoundError();
    }
    const user = await this.userRepository.getById(person.id);
    if (!user) {
      throw new PersonNotFoundError();
    }
    const actualStartDay = day || startDay;
    const actualEndDay = day || endDay;
    if (!actualStartDay || !actualEndDay) {
      throw new DateNotValidError();
    }
    const startYear = actualStartDay.getUTCFullYear();
    const startMonth = String(actualStartDay.getUTCMonth() + 1).padStart(2, "0");
    const startDayOfMonth = String(actualStartDay.getUTCDate()).padStart(2, "0");
    const startDayStr = `${startYear}-${startMonth}-${startDayOfMonth}`;
    const normalizedStartDate = validateDateTime(startDayStr, "00:00");
    if (!normalizedStartDate.isValid || !normalizedStartDate.dateTimeObj) {
      throw new DateNotValidError();
    }
    const endYear = actualEndDay.getUTCFullYear();
    const endMonth = String(actualEndDay.getUTCMonth() + 1).padStart(2, "0");
    const endDayOfMonth = String(actualEndDay.getUTCDate()).padStart(2, "0");
    const endDayStr = `${endYear}-${endMonth}-${endDayOfMonth}`;
    const normalizedEndDate = validateDateTime(endDayStr, "23:59");
    if (!normalizedEndDate.isValid || !normalizedEndDate.dateTimeObj) {
      throw new DateNotValidError();
    }
    const feelings = await this.feelingsRepository.getFeelingsByDate(
      userId,
      normalizedStartDate.dateTimeObj,
      normalizedEndDate.dateTimeObj
    );
    return {
      feelings
    };
  }
};

// src/factories/feelings-user/make-get-feelings-by-date-use-case.ts
function makeGetFeelingsByDateUseCase() {
  const prismaPersonRepository = new PrismaPersonRepository();
  const prismaUserRepository = new PrismaUserRepository();
  const prismaFeelingsRepository = new PrismaFeelingsRepository();
  const getFeelingsByDateUseCase = new GetFeelingsByDateUseCase(
    prismaPersonRepository,
    prismaUserRepository,
    prismaFeelingsRepository
  );
  return getFeelingsByDateUseCase;
}

// src/http/controllers/feelings-user/get-feelings-by-date-user.ts
var import_zod2 = __toESM(require("zod"));
var getFeelingsByDateUser = async (app2) => {
  app2.get(
    "/feelings/:userId",
    {
      schema: {
        tags: ["Feelings"],
        params: import_zod2.default.object({
          userId: import_zod2.default.uuid()
        }),
        querystring: import_zod2.default.object({
          startDay: import_zod2.default.coerce.date(),
          endDay: import_zod2.default.coerce.date()
        }),
        response: {
          200: import_zod2.default.object({
            feelings: import_zod2.default.object({
              description: import_zod2.default.enum([
                "TRISTE",
                "ANSIOSO",
                "TEDIO",
                "RAIVA",
                "N\xC3O_SEI_DIZER",
                "FELIZ"
              ]),
              id: import_zod2.default.uuid(),
              motive: import_zod2.default.string().nullable(),
              userPersonId: import_zod2.default.string(),
              createdAt: import_zod2.default.date(),
              updatedAt: import_zod2.default.date()
            }).array()
          }),
          404: import_zod2.default.object({ message: import_zod2.default.string() }),
          422: import_zod2.default.object({ message: import_zod2.default.string() }),
          500: import_zod2.default.object({ message: import_zod2.default.string() })
        }
      }
    },
    async (request, reply) => {
      const { userId } = request.params;
      const { startDay, endDay } = request.query;
      const getFeelingsByDateUseCase = makeGetFeelingsByDateUseCase();
      try {
        const { feelings } = await getFeelingsByDateUseCase.execute({
          userId,
          startDay,
          endDay
        });
        return reply.status(200).send({ feelings });
      } catch (error) {
        if (error instanceof PersonNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }
        if (error instanceof DateNotValidError) {
          return reply.status(422).send({ message: error.message });
        }
        return reply.status(500).send({ message: "Internal server error." });
      }
    }
  );
};

// src/http/controllers/feelings-user/routes.ts
function feelingsUserRoutes(app2) {
  app2.register(createFeelingsUser);
  app2.register(getFeelingsByDateUser);
}

// src/repositories/prisma/prisma-goal-repository.ts
var PrismaGoalRepository = class {
  async create(data) {
    const goal = await prisma.goal.create({
      data
    });
    return goal;
  }
  async findById(goalId) {
    const goal = await prisma.goal.findUnique({
      where: {
        id: goalId
      }
    });
    return goal;
  }
  async delete(goalId, personId) {
    await prisma.goal.deleteMany({
      where: {
        id: goalId,
        userPersonId: personId
      }
    });
  }
  async fetchManyGoals(personId) {
    const goals = await prisma.goal.findMany({
      where: {
        userPersonId: personId
      },
      orderBy: { createdAt: "desc" }
    });
    return goals;
  }
  async update(goalId, personId, goal) {
    const updatedGoal = await prisma.goal.update({
      where: {
        id: goalId,
        userPersonId: personId
      },
      data: goal
    });
    return updatedGoal;
  }
  async updateExecuteGoal(goalId, personId) {
    await prisma.goal.update({
      where: {
        id: goalId,
        userPersonId: personId
      },
      data: {
        isExecuted: true
      }
    });
  }
  async updateInactivateOldGoal(goalId, personId) {
    await prisma.goal.update({
      where: {
        id: goalId,
        userPersonId: personId
      },
      data: {
        isExpire: true
      }
    });
  }
  async addCounter(goalId, personId) {
    const goal = await prisma.goal.update({
      where: {
        id: goalId,
        userPersonId: personId
      },
      data: {
        counter: {
          increment: 1
        }
      }
    });
    return goal;
  }
  async getCountExecutedGoals(personId) {
    const countedExecutedGoals = await prisma.goal.count({
      where: {
        userPersonId: personId,
        isExecuted: true
      }
    });
    return countedExecutedGoals;
  }
};

// src/use-cases/goal/add-counter.ts
var AddCounterUseCase = class {
  constructor(goalRepository, personRepository) {
    this.goalRepository = goalRepository;
    this.personRepository = personRepository;
  }
  async execute({
    goalId,
    personId
  }) {
    const person = await this.personRepository.findById(personId);
    if (!person) {
      throw new PersonNotFoundError();
    }
    const goal = await this.goalRepository.findById(goalId);
    if (!goal) {
      throw new ResourceNotFoundError();
    }
    if (goal.counter <= goal.numberDays) {
      this.goalRepository.addCounter(goalId, personId);
    }
    return { goal };
  }
};

// src/factories/goal/make-add-counter-goal-use-case.ts
function makeAddCounterGoalUseCase() {
  const prismaGoalRepository = new PrismaGoalRepository();
  const prismaPersonRepository = new PrismaPersonRepository();
  const addCounterGoalUseCase = new AddCounterUseCase(
    prismaGoalRepository,
    prismaPersonRepository
  );
  return addCounterGoalUseCase;
}

// src/http/controllers/goal/add-counter.ts
var import_zod3 = __toESM(require("zod"));
var addCounter = async (app2) => {
  app2.patch(
    "/goal/counter/:goalId/:personId",
    {
      schema: {
        tags: ["Goal"],
        params: import_zod3.default.object({
          goalId: import_zod3.default.string(),
          personId: import_zod3.default.string()
        }),
        response: {
          200: import_zod3.default.void(),
          404: import_zod3.default.object({ message: import_zod3.default.string() }),
          500: import_zod3.default.object({ message: import_zod3.default.string() })
        }
      }
    },
    async (request, reply) => {
      const { goalId, personId } = request.params;
      const addCounterGoalUseCase = makeAddCounterGoalUseCase();
      try {
        await addCounterGoalUseCase.execute({ goalId, personId });
        return reply.status(200).send();
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }
        if (error instanceof PersonNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }
        return reply.status(500).send({ message: "Internal server error" });
      }
    }
  );
};

// src/use-cases/goal/create.ts
var CreateGoalUseCase = class {
  constructor(goalRepository, personRepository) {
    this.goalRepository = goalRepository;
    this.personRepository = personRepository;
  }
  async execute({
    userPersonId,
    description,
    numberDays
  }) {
    const person = await this.personRepository.findById(userPersonId);
    if (!person) {
      throw new ResourceNotFoundError();
    }
    const goal = await this.goalRepository.create({
      userPersonId,
      description,
      numberDays
    });
    return {
      goal
    };
  }
};

// src/factories/goal/make-create-goal-use-case.ts
function makeCreateGoalUseCase() {
  const prismaGoalRepository = new PrismaGoalRepository();
  const prismaPersonRepository = new PrismaPersonRepository();
  const createGoalUseCase = new CreateGoalUseCase(
    prismaGoalRepository,
    prismaPersonRepository
  );
  return createGoalUseCase;
}

// src/http/controllers/goal/create.ts
var import_v4 = require("zod/v4");
var create = async (app2) => {
  app2.post(
    "/goal",
    {
      schema: {
        tags: ["Goal"],
        body: import_v4.z.object({
          userPersonId: import_v4.z.string().uuid(),
          description: import_v4.z.string(),
          numberDays: import_v4.z.number().min(1)
        })
      }
    },
    async (request, reply) => {
      const { userPersonId, description, numberDays } = request.body;
      const createGoalUseCase = makeCreateGoalUseCase();
      try {
        await createGoalUseCase.execute({
          userPersonId,
          description,
          numberDays
        });
        return reply.status(201).send();
      } catch (error) {
        console.log("Error details:", error);
        if (error instanceof ResourceNotFoundError) {
          return reply.status(400).send({
            message: error.message
          });
        }
        return reply.status(500).send({
          message: "Internal server error"
        });
      }
    }
  );
};

// src/use-cases/goal/delete.ts
var DeleteGoalUseCase = class {
  constructor(goalRepository, personRepository) {
    this.goalRepository = goalRepository;
    this.personRepository = personRepository;
  }
  async execute({ goalId, personId }) {
    const person = await this.personRepository.findById(personId);
    if (!person) {
      throw new PersonNotFoundError();
    }
    const goal = await this.goalRepository.findById(goalId);
    if (!goal) {
      throw new ResourceNotFoundError();
    }
    this.goalRepository.delete(goalId, personId);
  }
};

// src/factories/goal/make-delete-goal-use-case.ts
function makeDeleteGoalUseCase() {
  const prismaGoalRepository = new PrismaGoalRepository();
  const personRepository = new PrismaPersonRepository();
  const deleteGoalUseCase = new DeleteGoalUseCase(
    prismaGoalRepository,
    personRepository
  );
  return deleteGoalUseCase;
}

// src/http/controllers/goal/delete.ts
var import_v42 = require("zod/v4");
var deleteGoal = async (app2) => {
  app2.delete(
    "/goal/:goalId/:personId",
    {
      schema: {
        tags: ["Goal"],
        params: import_v42.z.object({
          goalId: import_v42.z.uuid(),
          personId: import_v42.z.uuid()
        }),
        response: {
          204: import_v42.z.void(),
          404: import_v42.z.object({ message: import_v42.z.string() }),
          500: import_v42.z.object({ message: import_v42.z.string() })
        }
      }
    },
    async (request, reply) => {
      const { goalId, personId } = request.params;
      const deleteGoalUseCase = makeDeleteGoalUseCase();
      try {
        await deleteGoalUseCase.execute({ goalId, personId });
        return reply.status(204).send();
      } catch (error) {
        if (error instanceof PersonNotFoundError || error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    }
  );
};

// src/use-cases/goal/execute-goal-use-case.ts
var ExecuteGoalUseCase = class {
  constructor(goalRepository, personRepository) {
    this.goalRepository = goalRepository;
    this.personRepository = personRepository;
  }
  async execute({
    goalId,
    personId
  }) {
    const person = await this.personRepository.findById(personId);
    if (!person) {
      throw new ResourceNotFoundError();
    }
    const goal = await this.goalRepository.findById(goalId);
    if (!goal) {
      throw new ResourceNotFoundError();
    }
    this.goalRepository.updateExecuteGoal(goalId, personId);
    return {
      goal
    };
  }
};

// src/factories/goal/make-execute-goal-use-case.ts
function makeExecuteGoalUseCase() {
  const prismaGoalRepository = new PrismaGoalRepository();
  const prismaPersonRepository = new PrismaPersonRepository();
  const executeGoalUseCase = new ExecuteGoalUseCase(
    prismaGoalRepository,
    prismaPersonRepository
  );
  return executeGoalUseCase;
}

// src/http/controllers/goal/execute-goal.ts
var import_v43 = require("zod/v4");
var executeGoal = async (app2) => {
  app2.patch(
    "/goal/execute/:goalId/:personId",
    {
      schema: {
        tags: ["Goal"],
        params: import_v43.z.object({
          goalId: import_v43.z.uuid(),
          personId: import_v43.z.uuid()
        }),
        response: {
          200: import_v43.z.object({ message: import_v43.z.string() }),
          404: import_v43.z.object({ message: import_v43.z.string() }),
          500: import_v43.z.object({ message: import_v43.z.string() })
        }
      }
    },
    async (request, reply) => {
      const { goalId, personId } = request.params;
      const executeGoalUseCase = makeExecuteGoalUseCase();
      try {
        await executeGoalUseCase.execute({ goalId, personId });
        return reply.status(200).send();
      } catch (error) {
        console.log("Error executing goal:", error);
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }
        return reply.status(500).send({ message: "Internal server error" });
      }
    }
  );
};

// src/errors/not-existing-goals-registred.ts
var NotExistingGoalsRegisteredError = class extends Error {
  constructor() {
    super("No goals found for the specified person.");
  }
};

// src/use-cases/goal/fetch-many.ts
var FetchManyGoalsUseCase = class {
  constructor(goalRepository, personRepository) {
    this.goalRepository = goalRepository;
    this.personRepository = personRepository;
  }
  async execute({
    personId
  }) {
    const person = await this.personRepository.findById(personId);
    if (!person) {
      throw new PersonNotFoundError();
    }
    const goals = await this.goalRepository.fetchManyGoals(personId);
    if (!goals) {
      throw new NotExistingGoalsRegisteredError();
    }
    return { goals };
  }
};

// src/factories/goal/make-fetch-many-goals-use-case.ts
function makeFetchManyGoalsUseCase() {
  const prismaGoalRepository = new PrismaGoalRepository();
  const prismaPersonRepository = new PrismaPersonRepository();
  const fetchManyGoalsUseCase = new FetchManyGoalsUseCase(
    prismaGoalRepository,
    prismaPersonRepository
  );
  return fetchManyGoalsUseCase;
}

// src/http/controllers/goal/fetch-many.ts
var import_zod4 = __toESM(require("zod"));
var fechMany = async (app2) => {
  app2.get(
    "/goals/:personId",
    {
      schema: {
        tags: ["Goal"],
        params: import_zod4.default.object({
          personId: import_zod4.default.uuid()
        }),
        response: {
          200: import_zod4.default.object({
            goals: import_zod4.default.array(
              import_zod4.default.object({
                id: import_zod4.default.string(),
                description: import_zod4.default.string(),
                userPersonId: import_zod4.default.string(),
                numberDays: import_zod4.default.number(),
                isExecuted: import_zod4.default.boolean(),
                isExpire: import_zod4.default.boolean(),
                counter: import_zod4.default.number(),
                createdAt: import_zod4.default.date(),
                updatedAt: import_zod4.default.date()
              })
            )
          }),
          404: import_zod4.default.object({ message: import_zod4.default.string() }),
          500: import_zod4.default.object({ message: import_zod4.default.string() })
        }
      }
    },
    async (request, reply) => {
      const { personId } = request.params;
      const fetchManyGoalsUseCase = makeFetchManyGoalsUseCase();
      try {
        const { goals } = await fetchManyGoalsUseCase.execute({ personId });
        return reply.status(200).send({ goals });
      } catch (error) {
        if (error instanceof PersonNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }
        if (error instanceof NotExistingGoalsRegisteredError) {
          return reply.status(404).send({ message: error.message });
        }
        return reply.status(500).send({ message: "Internal server error" });
      }
    }
  );
};

// src/errors/goal-can-only-be-executed-once.ts
var GoalCanOnlyBeExecutedOnceError = class extends Error {
  constructor() {
    super("Goal can only be executed once");
  }
};

// src/errors/invalid-parameters.ts
var InvalidParametersError = class extends Error {
  constructor() {
    super("Invalid parameters");
  }
};

// src/use-cases/goal/update.ts
var UpdateGoalUseCase = class {
  constructor(goalRepository, personRepository) {
    this.goalRepository = goalRepository;
    this.personRepository = personRepository;
  }
  async execute({
    userPersonId,
    goalId,
    description,
    numberDays
  }) {
    const person = await this.personRepository.findById(userPersonId);
    if (!person) {
      throw new InvalidParametersError();
    }
    const goal = await this.goalRepository.findById(goalId);
    if (!goal) {
      throw new InvalidParametersError();
    }
    if (goal.isExecuted === true) {
      throw new GoalCanOnlyBeExecutedOnceError();
    }
    const updatedGoal = await this.goalRepository.update(goalId, userPersonId, {
      description,
      numberDays
    });
    return { goal: updatedGoal };
  }
};

// src/factories/goal/make-update-goal-use-case.ts
function makeUpdateGoalUseCase() {
  const prismaGoalRepository = new PrismaGoalRepository();
  const prismaPersonRepository = new PrismaPersonRepository();
  const updateGoalUseCase = new UpdateGoalUseCase(
    prismaGoalRepository,
    prismaPersonRepository
  );
  return updateGoalUseCase;
}

// src/http/controllers/goal/update.ts
var import_zod5 = __toESM(require("zod"));
var update = async (app2) => {
  app2.patch(
    "/goal/update/:goalId/:personId",
    {
      schema: {
        tags: ["Goal"],
        params: import_zod5.default.object({
          goalId: import_zod5.default.uuid(),
          personId: import_zod5.default.uuid()
        }),
        body: import_zod5.default.object({
          description: import_zod5.default.string().max(255).optional(),
          numberDays: import_zod5.default.number().min(1).optional()
        }),
        response: {
          200: import_zod5.default.void(),
          400: import_zod5.default.object({ message: import_zod5.default.string() }),
          409: import_zod5.default.object({ message: import_zod5.default.string() }),
          500: import_zod5.default.object({ message: import_zod5.default.string() })
        }
      }
    },
    async (request, reply) => {
      const { goalId, personId } = request.params;
      const { description, numberDays } = request.body;
      const updateGoalUseCase = makeUpdateGoalUseCase();
      try {
        await updateGoalUseCase.execute({
          goalId,
          userPersonId: personId,
          description,
          numberDays
        });
        return reply.status(200).send();
      } catch (error) {
        if (error instanceof InvalidParametersError) {
          return reply.status(400).send({ message: error.message });
        }
        if (error instanceof GoalCanOnlyBeExecutedOnceError) {
          return reply.status(409).send({ message: error.message });
        }
        return reply.status(500).send({ message: "Internal server error" });
      }
    }
  );
};

// src/http/controllers/goal/routes.ts
function routesGoal(app2) {
  app2.register(create);
  app2.register(deleteGoal);
  app2.register(executeGoal);
  app2.register(fechMany);
  app2.register(update);
  app2.register(addCounter);
}

// src/repositories/prisma/prisma-hourly-repository.ts
var import_date_fns2 = require("date-fns");
var import_node_crypto = require("crypto");
var PrismaHourlyRepository = class {
  async createMany(data) {
    await prisma.hourly.createMany({
      data
    });
    const scheduleIds = [...new Set(data.map((item) => item.scheduleId))];
    const hourlies = await prisma.hourly.findMany({
      where: {
        scheduleId: {
          in: scheduleIds
        }
      }
    });
    return hourlies;
  }
  async createHourlySlots(scheduleId, initialTime, endTime, interval) {
    const slotsData = [];
    let currentTime = new Date(initialTime);
    while ((0, import_date_fns2.isBefore)(currentTime, endTime)) {
      const hourUTC = currentTime.getUTCHours().toString().padStart(2, "0");
      const minuteUTC = currentTime.getUTCMinutes().toString().padStart(2, "0");
      slotsData.push({
        id: (0, import_node_crypto.randomUUID)(),
        isOcuped: false,
        date: new Date(currentTime),
        hour: `${hourUTC}:${minuteUTC}`,
        scheduleId
      });
      currentTime = (0, import_date_fns2.addMinutes)(currentTime, interval);
    }
    await this.createMany(slotsData);
    const hourlies = await prisma.hourly.findMany({
      where: {
        scheduleId
      }
    });
    return hourlies;
  }
  async fetchManyByScheduleId(scheduleId) {
    const hourlies = await prisma.hourly.findMany({
      where: {
        scheduleId
      }
    });
    return hourlies;
  }
  async getHourlyByDateAndHour(date, hour) {
    const hourly = await prisma.hourly.findFirst({
      where: {
        date,
        hour
      }
    });
    return hourly;
  }
  async updateStatusOcuped(hourlyId) {
    const hourly = await prisma.hourly.update({
      where: {
        id: hourlyId
      },
      data: {
        isOcuped: true
      }
    });
    return hourly;
  }
  async getById(id) {
    const hourly = await prisma.hourly.findUnique({
      where: {
        id
      }
    });
    return hourly;
  }
};

// src/repositories/prisma/prisma-schedule-repository.ts
var PrismaScheduleRepository = class {
  async create(data) {
    const schedule = await prisma.schedule.create({
      data
    });
    return schedule;
  }
  async getById(id) {
    const schedule = await prisma.schedule.findUnique({
      where: { id }
    });
    return schedule;
  }
  async fetchMany(professionalPersonId) {
    const schedules = await prisma.schedule.findMany({
      where: { professionalPersonId }
    });
    return schedules;
  }
};

// src/use-cases/hourlies/fetch-many-by-schedule-id.ts
var FetchManyHourliesByScheduleIdUseCase = class {
  constructor(hourlyRepository, scheduleRepository) {
    this.hourlyRepository = hourlyRepository;
    this.scheduleRepository = scheduleRepository;
  }
  async execute({
    scheduleId
  }) {
    const schedule = await this.scheduleRepository.getById(scheduleId);
    if (!schedule) {
      throw new ResourceNotFoundError();
    }
    const hourlies = await this.hourlyRepository.fetchManyByScheduleId(scheduleId);
    return { hourlies };
  }
};

// src/factories/hourlies/make-fetch-many-by-schedule-id-use-case.ts
function makeFetchManyByScheduleIdUseCase() {
  const prismaHourlyRepository = new PrismaHourlyRepository();
  const prismaScheduleRepository = new PrismaScheduleRepository();
  const fetchManyHourliesByScheduleIdUseCase = new FetchManyHourliesByScheduleIdUseCase(
    prismaHourlyRepository,
    prismaScheduleRepository
  );
  return fetchManyHourliesByScheduleIdUseCase;
}

// src/http/controllers/hourlies/fetch-many-by-schedule-id.ts
var import_zod6 = __toESM(require("zod"));
var fetchManyByScheduleId = async (app2) => {
  app2.get(
    "/hourlies/:scheduleId",
    {
      schema: {
        tags: ["Hourlies"],
        params: import_zod6.default.object({
          scheduleId: import_zod6.default.uuid()
        }),
        response: {
          200: import_zod6.default.object({
            hourlies: import_zod6.default.object({
              scheduleId: import_zod6.default.string(),
              date: import_zod6.default.date(),
              id: import_zod6.default.string(),
              hour: import_zod6.default.string(),
              isOcuped: import_zod6.default.boolean()
            }).array()
          }),
          404: import_zod6.default.object({
            message: import_zod6.default.string()
          }),
          500: import_zod6.default.object({
            message: import_zod6.default.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { scheduleId } = request.params;
      const fetchManyByScheduleIdUseCase = makeFetchManyByScheduleIdUseCase();
      try {
        const { hourlies } = await fetchManyByScheduleIdUseCase.execute({
          scheduleId
        });
        return reply.status(200).send({ hourlies });
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }
        return reply.status(500).send({ message: "Internal server error." });
      }
    }
  );
};

// src/http/controllers/hourlies/routes.ts
function hourliesRoutes(app2) {
  app2.register(fetchManyByScheduleId);
}

// src/errors/invalid-credentials.ts
var InvalidCredentialsError = class extends Error {
  constructor() {
    super("Invalid credentials");
  }
};

// src/use-cases/person/authenticate.ts
var import_bcryptjs = require("bcryptjs");
var AuthenticatePersonUseCase = class {
  constructor(personRepository) {
    this.personRepository = personRepository;
  }
  async execute({
    email,
    password
  }) {
    const person = await this.personRepository.findByEmail(email);
    if (!person) {
      throw new InvalidCredentialsError();
    }
    const doesPasswordMatch = await (0, import_bcryptjs.compare)(password, person.password_hash);
    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError();
    }
    return {
      user: {
        isAuthenticated: true,
        userId: person.id
      }
    };
  }
};

// src/factories/person/make-authenticate-person-use-case.ts
function makeAuthenticatePersonUseCase() {
  const prismaPersonRepository = new PrismaPersonRepository();
  const authenticatePersonUseCase = new AuthenticatePersonUseCase(
    prismaPersonRepository
  );
  return authenticatePersonUseCase;
}

// src/http/controllers/person/authenticate.ts
var import_zod7 = require("zod");
var authenticate = async (app2) => {
  app2.post(
    "/persons/authenticate",
    {
      schema: {
        tags: ["Users", "Professional"],
        body: import_zod7.z.object({
          email: import_zod7.z.email(),
          password: import_zod7.z.string().min(6)
        }),
        response: {
          200: import_zod7.z.object({
            user: import_zod7.z.object({
              userId: import_zod7.z.uuid(),
              isAuthenticated: import_zod7.z.boolean()
            })
          }),
          401: import_zod7.z.object({
            message: import_zod7.z.string()
          }),
          500: import_zod7.z.object({
            message: import_zod7.z.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { email, password } = request.body;
      const authenticatePersonUseCase = makeAuthenticatePersonUseCase();
      try {
        const { user } = await authenticatePersonUseCase.execute({
          email,
          password
        });
        return reply.status(200).send({ user });
      } catch (error) {
        if (error instanceof InvalidCredentialsError) {
          return reply.status(401).send({ message: error.message });
        }
        return reply.status(500).send({ message: "Internal server error." });
      }
    }
  );
};

// src/use-cases/person/user/get-me-user.ts
var GetMeUserUseCase = class {
  constructor(personRepository, feelingsRepository, goalRepository) {
    this.personRepository = personRepository;
    this.feelingsRepository = feelingsRepository;
    this.goalRepository = goalRepository;
  }
  async execute({
    userId
  }) {
    const personUser = await this.personRepository.findById(userId);
    if (!personUser) {
      throw new PersonNotFoundError();
    }
    const lastFeeling = await this.feelingsRepository.getLastFeelingsByUserId(userId);
    const countExecutedGoals = await this.goalRepository.getCountExecutedGoals(
      personUser.id
    );
    const profile = {
      nameUser: personUser.name,
      cityAndUf: {
        city: personUser.city,
        uf: personUser.uf
      },
      lastFeeling: lastFeeling?.description ?? void 0,
      countExecutedGoals: countExecutedGoals ?? 0
    };
    return { profile };
  }
};

// src/factories/person/make-get-me-user-use-case.ts
function makeGetMeUserUseCase() {
  const prismaPersonRepository = new PrismaPersonRepository();
  const prismaFeelingsRepository = new PrismaFeelingsRepository();
  const prismaGoalRepository = new PrismaGoalRepository();
  const getMeUserUseCase = new GetMeUserUseCase(
    prismaPersonRepository,
    prismaFeelingsRepository,
    prismaGoalRepository
  );
  return getMeUserUseCase;
}

// src/http/controllers/person/get-me-user.ts
var import_zod8 = __toESM(require("zod"));
var getMeUser = async (app2) => {
  app2.get(
    "/me/:userId",
    {
      schema: {
        tags: ["Users"],
        params: import_zod8.default.object({
          userId: import_zod8.default.string().uuid()
        }),
        response: {
          200: import_zod8.default.object({
            profile: import_zod8.default.object({
              nameUser: import_zod8.default.string(),
              cityAndUf: import_zod8.default.object({
                city: import_zod8.default.string(),
                uf: import_zod8.default.string()
              }),
              lastFeeling: import_zod8.default.string().optional(),
              countExecutedGoals: import_zod8.default.number()
            })
          }),
          404: import_zod8.default.object({ message: import_zod8.default.string() }),
          500: import_zod8.default.object({ message: import_zod8.default.string() })
        }
      }
    },
    async (request, reply) => {
      const { userId } = request.params;
      const getMeUserUseCase = makeGetMeUserUseCase();
      try {
        const { profile } = await getMeUserUseCase.execute({ userId });
        return reply.status(200).send({ profile });
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }
        return reply.status(500).send({ message: "Internal server error." });
      }
    }
  );
};

// src/use-cases/person/user/get-user-by-id.ts
var GetUserByIdUseCase = class {
  constructor(personRepository, userRepository) {
    this.personRepository = personRepository;
    this.userRepository = userRepository;
  }
  async execute({
    userId
  }) {
    const person = await this.personRepository.findById(userId);
    if (!person) {
      throw new PersonNotFoundError();
    }
    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw new PersonNotFoundError();
    }
    return {
      user: {
        name: person.name,
        birthDate: person.birth_date,
        phone: person.phone,
        email: person.email,
        cpf: person.cpf,
        gender: user.gender,
        address: {
          street: person.address,
          neighborhood: person.neighborhood,
          number: person.number,
          cep: person.cep,
          city: person.city
        }
      }
    };
  }
};

// src/factories/person/make-get-user-by-id-use-case.ts
function makeGetUserByIdUseCase() {
  const prismaPersonRepository = new PrismaPersonRepository();
  const prismaUserRepository = new PrismaUserRepository();
  const getUserByIdUseCase = new GetUserByIdUseCase(
    prismaPersonRepository,
    prismaUserRepository
  );
  return getUserByIdUseCase;
}

// src/http/controllers/person/get-user-by-id.ts
var import_zod9 = __toESM(require("zod"));
var getUserById = async (app2) => {
  app2.get(
    "/users/:userId",
    {
      schema: {
        tags: ["Users"],
        params: import_zod9.default.object({
          userId: import_zod9.default.uuid()
        }),
        response: {
          200: import_zod9.default.object({
            user: import_zod9.default.object({
              name: import_zod9.default.string(),
              birthDate: import_zod9.default.date(),
              phone: import_zod9.default.string(),
              email: import_zod9.default.email(),
              cpf: import_zod9.default.string(),
              gender: import_zod9.default.string(),
              address: import_zod9.default.object({
                street: import_zod9.default.string(),
                neighborhood: import_zod9.default.string(),
                number: import_zod9.default.number(),
                cep: import_zod9.default.string(),
                city: import_zod9.default.string()
              })
            })
          }),
          404: import_zod9.default.object({
            message: import_zod9.default.string()
          }),
          500: import_zod9.default.object({
            message: import_zod9.default.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { userId } = request.params;
      const getUserByIdUseCase = makeGetUserByIdUseCase();
      try {
        const { user } = await getUserByIdUseCase.execute({ userId });
        return reply.status(200).send({ user });
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    }
  );
};

// src/http/controllers/person/register-professional.ts
var import_v44 = require("zod/v4");

// src/errors/email-already-exists-error.ts
var EmailAlreadyExistsError = class extends Error {
  constructor() {
    super("Email Already Exists Error");
  }
};

// src/use-cases/person/register.ts
var import_bcryptjs2 = require("bcryptjs");
var RegisterUseCase = class {
  constructor(registerPersonRepository) {
    this.registerPersonRepository = registerPersonRepository;
  }
  async execute({
    name,
    birth_date,
    cpf,
    address,
    neighborhood,
    number,
    complement,
    cepUser,
    city,
    uf,
    phone,
    email,
    password
  }) {
    const password_hash = await (0, import_bcryptjs2.hash)(password, 6);
    const cleanCep = cepUser.replace("-", "");
    const cep = /^\d{8}$/.test(cleanCep);
    if (!cep) {
      throw new InvalidParametersError();
    }
    const emailAlreadyExists = await this.registerPersonRepository.findByEmail(email);
    if (emailAlreadyExists) {
      throw new EmailAlreadyExistsError();
    }
    const person = await this.registerPersonRepository.create({
      name,
      birth_date,
      cpf,
      address,
      neighborhood,
      number,
      complement,
      cep: cepUser,
      city,
      uf,
      phone,
      email,
      password_hash
    });
    return {
      person
    };
  }
};

// src/factories/person/make-register-person-use-case.ts
function makePersonUseCase() {
  const prismaPersonRepository = new PrismaPersonRepository();
  const registerUseCase = new RegisterUseCase(prismaPersonRepository);
  return registerUseCase;
}

// src/repositories/prisma/prisma-professional-repository.ts
var PrismaProfessionalRepository = class {
  async create(data) {
    const professional = await prisma.professional.create({
      data
    });
    return professional;
  }
  async fetchMany(search) {
    const professionals = await prisma.$queryRaw`
      SELECT person.name, person.email, person.phone, person.address, person.neighborhood, person.city, person.uf, person.id
      FROM professionals
      LEFT JOIN person ON professionals.person_id = person.id
      WHERE person.name ILIKE '%' || ${search} || '%'
    `;
    return professionals;
  }
  async getById(professionalId) {
    const professional = await prisma.professional.findUnique({
      where: {
        person_id: professionalId
      },
      include: {
        person: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            neighborhood: true,
            city: true,
            uf: true
          }
        }
      }
    });
    if (!professional || !professional.person) {
      return null;
    }
    return {
      id: professional.person.id,
      name: professional.person.name,
      email: professional.person.email,
      phone: professional.person.phone,
      address: professional.person.address,
      neighborhood: professional.person.neighborhood,
      city: professional.person.city,
      uf: professional.person.uf,
      voluntary: professional.voluntary
    };
  }
};

// src/use-cases/person/professional/register-professional.ts
var RegisterProfessionalUseCase = class {
  constructor(registerProfessionalRepository, registerPersonRepository) {
    this.registerProfessionalRepository = registerProfessionalRepository;
    this.registerPersonRepository = registerPersonRepository;
  }
  async execute({
    person_id,
    crp,
    voluntary
  }) {
    const person = await this.registerPersonRepository.findById(person_id);
    if (!person) {
      throw new ResourceNotFoundError();
    }
    const professional = await this.registerProfessionalRepository.create({
      person_id: person.id,
      crp,
      voluntary
    });
    return {
      professional
    };
  }
};

// src/factories/person/make-register-professional-use-case.ts
function makeRegisterProfessionalUseCase() {
  const prismaPersonRepository = new PrismaPersonRepository();
  const prismaProfessionalRepository = new PrismaProfessionalRepository();
  const registerProfessionalUseCase = new RegisterProfessionalUseCase(
    prismaProfessionalRepository,
    prismaPersonRepository
  );
  return registerProfessionalUseCase;
}

// src/http/controllers/person/register-professional.ts
var registerProfessional = async (app2) => {
  app2.post(
    "/professional",
    {
      schema: {
        tags: ["Professional"],
        body: import_v44.z.object({
          name: import_v44.z.string(),
          birth_date: import_v44.z.coerce.date(),
          cpf: import_v44.z.string(),
          address: import_v44.z.string(),
          neighborhood: import_v44.z.string(),
          number: import_v44.z.number(),
          complement: import_v44.z.string(),
          cepUser: import_v44.z.string(),
          city: import_v44.z.string(),
          uf: import_v44.z.string(),
          phone: import_v44.z.string(),
          email: import_v44.z.email(),
          password: import_v44.z.string(),
          crp: import_v44.z.string(),
          voluntary: import_v44.z.boolean()
        }),
        response: {
          201: import_v44.z.object({
            professional: import_v44.z.object({
              person_id: import_v44.z.string(),
              crp: import_v44.z.string(),
              voluntary: import_v44.z.boolean()
            })
          }),
          409: import_v44.z.object({
            message: import_v44.z.string()
          })
        }
      }
    },
    async (request, reply) => {
      const {
        name,
        birth_date,
        cpf,
        address,
        neighborhood,
        number,
        complement,
        cepUser,
        city,
        uf,
        phone,
        email,
        password,
        crp,
        voluntary
      } = request.body;
      const registerPersonUseCase = makePersonUseCase();
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
        password
      });
      const professionalUseCase = makeRegisterProfessionalUseCase();
      try {
        const { professional } = await professionalUseCase.execute({
          person_id: person.id,
          crp,
          voluntary
        });
        return reply.status(201).send({ professional });
      } catch (err) {
        if (err instanceof ResourceNotFoundError) {
          return reply.status(409).send({ message: "Resource not found" });
        }
        if (err instanceof InvalidParametersError) {
          return reply.status(409).send({ message: "Invalid parameters" });
        }
        return reply.status(409).send({ message: "Unknown error" });
      }
    }
  );
};

// src/use-cases/person/user/register-user.ts
var RegisterUserUseCase = class {
  constructor(userRepository, personRepository) {
    this.userRepository = userRepository;
    this.personRepository = personRepository;
  }
  async execute({
    person_id,
    gender
  }) {
    const person = await this.personRepository.findById(person_id);
    if (!person) {
      throw new ResourceNotFoundError();
    }
    const user = await this.userRepository.create({
      person_id: person.id,
      gender: gender ?? "N\xE3o definido"
    });
    return {
      user
    };
  }
};

// src/factories/person/make-register-user-use-case.ts
function makeRegisterUserUseCase() {
  const prismaUserRepository = new PrismaUserRepository();
  const prismaPersonRepository = new PrismaPersonRepository();
  const userUseCase = new RegisterUserUseCase(
    prismaUserRepository,
    prismaPersonRepository
  );
  return userUseCase;
}

// src/http/controllers/person/register-user.ts
var import_v45 = require("zod/v4");
var registerUser = async (app2) => {
  app2.post(
    "/users",
    {
      schema: {
        tags: ["Users"],
        body: import_v45.z.object({
          name: import_v45.z.string(),
          birth_date: import_v45.z.coerce.date(),
          cpf: import_v45.z.string(),
          address: import_v45.z.string(),
          neighborhood: import_v45.z.string(),
          number: import_v45.z.number(),
          complement: import_v45.z.string(),
          cepUser: import_v45.z.string(),
          city: import_v45.z.string(),
          uf: import_v45.z.string(),
          phone: import_v45.z.string(),
          email: import_v45.z.email(),
          password: import_v45.z.string(),
          gender: import_v45.z.string().optional()
        }),
        response: {
          201: import_v45.z.object({
            user: import_v45.z.object({
              person_id: import_v45.z.string(),
              gender: import_v45.z.string()
            })
          }),
          400: import_v45.z.object({ message: import_v45.z.string() }),
          500: import_v45.z.object({ message: import_v45.z.string() })
        }
      }
    },
    async (request, reply) => {
      const {
        name,
        birth_date,
        cpf,
        address,
        neighborhood,
        number,
        complement,
        cepUser,
        city,
        uf,
        phone,
        email,
        password,
        gender
      } = request.body;
      try {
        const personUseCase = makePersonUseCase();
        const { person } = await personUseCase.execute({
          name,
          birth_date,
          cpf,
          address,
          neighborhood,
          number,
          complement,
          cepUser,
          city,
          uf,
          phone,
          email,
          password
        });
        const userUseCase = makeRegisterUserUseCase();
        const { user } = await userUseCase.execute({
          person_id: person.id,
          gender
        });
        reply.status(201).send({ user });
      } catch (error) {
        if (error instanceof EmailAlreadyExistsError) {
          return reply.status(400).send({ message: error.message });
        }
        if (error instanceof Error) {
          return reply.status(500).send({ message: error.message });
        }
        return reply.status(500).send({ message: "An unexpected error occurred" });
      }
    }
  );
};

// src/http/controllers/person/routes.ts
async function personRoutes(app2) {
  app2.register(registerProfessional);
  app2.register(registerUser);
  app2.register(authenticate);
  app2.register(getMeUser);
  app2.register(getUserById);
}

// src/use-cases/professional/fetch-many.ts
var FetchManyProfessionalsUseCase = class {
  constructor(professionalRepository) {
    this.professionalRepository = professionalRepository;
  }
  async execute({ search }) {
    const professionals = await this.professionalRepository.fetchMany(search);
    return { professionals };
  }
};

// src/factories/professional/make-fetch-many-professionals-use-case.ts
function makeFetchManyProfessionalsUseCase() {
  const prismaProfessionalRepository = new PrismaProfessionalRepository();
  const fetchManyProfessionalsUseCase = new FetchManyProfessionalsUseCase(
    prismaProfessionalRepository
  );
  return fetchManyProfessionalsUseCase;
}

// src/http/controllers/professional/fetch-many.ts
var import_v46 = require("zod/v4");
var fetchMany = async (app2) => {
  app2.get(
    "/professionals",
    {
      schema: {
        tags: ["Professional"],
        querystring: import_v46.z.object({
          search: import_v46.z.string()
        }),
        response: {
          200: import_v46.z.object({
            professionals: import_v46.z.array(
              import_v46.z.object({
                id: import_v46.z.uuid(),
                name: import_v46.z.string(),
                email: import_v46.z.string(),
                phone: import_v46.z.string(),
                address: import_v46.z.string(),
                neighborhood: import_v46.z.string(),
                city: import_v46.z.string(),
                uf: import_v46.z.string()
              })
            )
          }),
          400: import_v46.z.object({
            message: import_v46.z.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { search } = request.query;
      const fetchManyProfessionalsUseCase = makeFetchManyProfessionalsUseCase();
      try {
        const { professionals } = await fetchManyProfessionalsUseCase.execute({
          search
        });
        return reply.status(200).send({ professionals });
      } catch (err) {
        if (err instanceof Error) {
          return reply.status(400).send({
            message: err.message
          });
        }
      }
    }
  );
};

// src/use-cases/professional/get-professional.ts
var GetProfessionalByIdUseCase = class {
  constructor(professionalRepository) {
    this.professionalRepository = professionalRepository;
  }
  async execute({
    professionalId
  }) {
    const professional = await this.professionalRepository.getById(professionalId);
    if (!professional) {
      throw new ResourceNotFoundError();
    }
    return { professional };
  }
};

// src/factories/professional/make-get-by-id-professional-use-case.ts
function makeGetByIdProfessionalUseCase() {
  const prismaProfessionalRepository = new PrismaProfessionalRepository();
  const getByIdProfessionalUseCase = new GetProfessionalByIdUseCase(
    prismaProfessionalRepository
  );
  return getByIdProfessionalUseCase;
}

// src/http/controllers/professional/get-by-id.ts
var import_v47 = require("zod/v4");
var getById = async (app2) => {
  app2.get(
    "/professional/:professionalId",
    {
      schema: {
        tags: ["Professional"],
        params: import_v47.z.object({
          professionalId: import_v47.z.string()
        }),
        response: {
          200: import_v47.z.object({
            professional: import_v47.z.object({
              id: import_v47.z.uuid(),
              name: import_v47.z.string(),
              email: import_v47.z.string(),
              phone: import_v47.z.string(),
              address: import_v47.z.string(),
              neighborhood: import_v47.z.string(),
              city: import_v47.z.string(),
              uf: import_v47.z.string()
            })
          }),
          400: import_v47.z.object({
            message: import_v47.z.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { professionalId } = request.params;
      const getByIdProfessionalUseCase = makeGetByIdProfessionalUseCase();
      try {
        const { professional } = await getByIdProfessionalUseCase.execute({
          professionalId
        });
        return reply.status(200).send({ professional });
      } catch (err) {
        if (err instanceof ResourceNotFoundError) {
          return reply.status(400).send({
            message: err.message
          });
        }
      }
    }
  );
};

// src/http/controllers/professional/routes.ts
function routesProfessional(app2) {
  app2.register(fetchMany);
  app2.register(getById);
}

// src/use-cases/schedule/create.ts
var import_date_fns3 = require("date-fns");
var CreateScheduleUseCase = class {
  constructor(scheduleRepository, hourlyRepository, professionalRepository) {
    this.scheduleRepository = scheduleRepository;
    this.hourlyRepository = hourlyRepository;
    this.professionalRepository = professionalRepository;
  }
  async execute({
    professionalPersonId,
    schedules
  }) {
    const professionalPerson = await this.professionalRepository.getById(professionalPersonId);
    if (!professionalPerson) {
      throw new PersonNotFoundError();
    }
    const createdSchedules = await Promise.all(
      schedules.map(async (scheduleItem) => {
        const {
          initialTime,
          endTime,
          interval,
          cancellationPolicy,
          averageValue,
          observation,
          isControlled
        } = scheduleItem;
        const finalAverageValue = professionalPerson.voluntary ? 0 : averageValue;
        const schedule = await this.scheduleRepository.create({
          professionalPersonId,
          averageValue: finalAverageValue,
          cancellationPolicy,
          observation,
          interval,
          isControlled,
          initialTime,
          endTime
        });
        if (scheduleItem.initialTime < /* @__PURE__ */ new Date()) {
          throw new DateNotValidError();
        }
        if (schedule.isControlled) {
          const dateIsValid = (0, import_date_fns3.isValid)(scheduleItem.initialTime) && (0, import_date_fns3.isValid)(scheduleItem.endTime);
          if (!dateIsValid) {
            throw new DateNotValidError();
          }
          await this.hourlyRepository.createHourlySlots(
            schedule.id,
            initialTime,
            endTime,
            scheduleItem.interval
          );
        }
        return schedule;
      })
    );
    return { schedule: createdSchedules };
  }
};

// src/factories/schedule/make-create-schedule-use-case.ts
function makeCreateScheduleUseCase() {
  const prismaScheduleRepository = new PrismaScheduleRepository();
  const prismaHourlyRepository = new PrismaHourlyRepository();
  const prismaProfessionalRepository = new PrismaProfessionalRepository();
  const createScheduleUseCase = new CreateScheduleUseCase(
    prismaScheduleRepository,
    prismaHourlyRepository,
    prismaProfessionalRepository
  );
  return createScheduleUseCase;
}

// src/http/controllers/schedule/create-schedule.ts
var import_zod10 = __toESM(require("zod"));
var createSchedule = async (app2) => {
  app2.post(
    "/schedules/:professionalPersonId",
    {
      schema: {
        tags: ["Schedules"],
        params: import_zod10.default.object({
          professionalPersonId: import_zod10.default.uuid()
        }),
        body: import_zod10.default.object({
          initialTime: import_zod10.default.coerce.date(),
          endTime: import_zod10.default.coerce.date(),
          interval: import_zod10.default.number(),
          cancellationPolicy: import_zod10.default.number(),
          averageValue: import_zod10.default.number(),
          observation: import_zod10.default.string().max(500),
          isControlled: import_zod10.default.boolean()
        }).array(),
        response: {
          201: import_zod10.default.void(),
          400: import_zod10.default.object({ message: import_zod10.default.string() }),
          500: import_zod10.default.object({ message: import_zod10.default.string() })
        }
      }
    },
    async (request, reply) => {
      const { professionalPersonId } = request.params;
      const schedules = request.body;
      const createScheduleUseCase = makeCreateScheduleUseCase();
      try {
        await createScheduleUseCase.execute({
          professionalPersonId,
          schedules
        });
        return reply.status(201).send();
      } catch (error) {
        if (error instanceof DateNotValidError) {
          return reply.status(400).send({ message: error.message });
        }
        return reply.status(500).send({ message: "Internal server error." });
      }
    }
  );
};

// src/errors/not-existing-schedules.ts
var NotExistingSchedulesError = class extends Error {
  constructor() {
    super("No existing schedules found");
  }
};

// src/use-cases/schedule/fetch-many.ts
var FetchManySchedulesUseCase = class {
  constructor(scheduleRepository, professionalRepository) {
    this.scheduleRepository = scheduleRepository;
    this.professionalRepository = professionalRepository;
  }
  async execute({
    professionalId
  }) {
    const professional = await this.professionalRepository.getById(professionalId);
    if (!professional) {
      throw new PersonNotFoundError();
    }
    const schedules = await this.scheduleRepository.fetchMany(professionalId);
    if (!schedules) {
      throw new NotExistingSchedulesError();
    }
    if (schedules.length === 0) {
      throw new NotExistingSchedulesError();
    }
    return { schedules };
  }
};

// src/factories/schedule/make-fetch-many-schedule-use-case.ts
function makeFetchManyScheduleUseCase() {
  const prismaProfessionalRepository = new PrismaProfessionalRepository();
  const prismaScheduleRepository = new PrismaScheduleRepository();
  const fetchManySchedulesUseCase = new FetchManySchedulesUseCase(
    prismaScheduleRepository,
    prismaProfessionalRepository
  );
  return fetchManySchedulesUseCase;
}

// src/http/controllers/schedule/fetch-many-schedule.ts
var import_zod11 = __toESM(require("zod"));
var fetchManySchedule = async (app2) => {
  app2.get(
    "/schedules/:professionalId",
    {
      schema: {
        tags: ["Schedules"],
        params: import_zod11.default.object({
          professionalId: import_zod11.default.uuid()
        }),
        response: {
          200: import_zod11.default.object({
            schedules: import_zod11.default.object({
              id: import_zod11.default.uuid(),
              professionalPersonId: import_zod11.default.uuid(),
              initialTime: import_zod11.default.date().nullable(),
              endTime: import_zod11.default.date().nullable(),
              interval: import_zod11.default.number(),
              cancellationPolicy: import_zod11.default.number(),
              averageValue: import_zod11.default.coerce.string(),
              observation: import_zod11.default.string().nullable(),
              isControlled: import_zod11.default.boolean(),
              createdAt: import_zod11.default.date()
            }).array()
          }),
          404: import_zod11.default.object({ message: import_zod11.default.string() }),
          500: import_zod11.default.object({ message: import_zod11.default.string() })
        }
      }
    },
    async (request, reply) => {
      const { professionalId } = request.params;
      const fetchManySchedulesUseCase = makeFetchManyScheduleUseCase();
      try {
        const { schedules } = await fetchManySchedulesUseCase.execute({
          professionalId
        });
        return reply.status(200).send({ schedules });
      } catch (error) {
        if (error instanceof NotExistingSchedulesError) {
          return reply.status(404).send({ message: error.message });
        }
        return reply.status(500).send({ message: "Internal server error" });
      }
    }
  );
};

// src/http/controllers/schedule/routes.ts
function scheduleRoutes(app2) {
  app2.register(createSchedule);
  app2.register(fetchManySchedule);
}

// src/repositories/prisma/prisma-scheduling-repository.ts
var PrismaSchedulingRepository = class {
  async create(data) {
    const scheduling = await prisma.scheduling.create({
      data
    });
    return scheduling;
  }
  async getByUserId(userId) {
    const scheduling = await prisma.scheduling.findFirst({
      where: { userPersonId: userId },
      orderBy: { createdAt: "desc" }
    });
    return scheduling;
  }
  async getPatientsByProfessionalId(professionalId) {
    const patients = await prisma.scheduling.findMany({
      where: { professionalPersonId: professionalId },
      distinct: ["userPersonId"]
    });
    const numberPatients = patients.length;
    return numberPatients;
  }
  async getSchedulingsByDate(professionalId, startDay, endDay) {
    const schedulings = await prisma.scheduling.findMany({
      where: {
        professionalPersonId: professionalId,
        createdAt: {
          gte: startDay,
          lte: endDay
        }
      },
      orderBy: {
        createdAt: "asc"
      }
    });
    const schedulingsCount = schedulings.length;
    if (schedulingsCount === 0) {
      return null;
    }
    return schedulingsCount;
  }
};

// src/use-cases/scheduling/create.ts
var CreateSchedulingUseCase = class {
  constructor(scheduleRepository, schedulingRepository, hourlyRepository, professionalRepository, userRepository) {
    this.scheduleRepository = scheduleRepository;
    this.schedulingRepository = schedulingRepository;
    this.hourlyRepository = hourlyRepository;
    this.professionalRepository = professionalRepository;
    this.userRepository = userRepository;
  }
  async execute({
    date,
    hour,
    scheduleId,
    professionalPersonId,
    userPersonId
  }) {
    const professional = await this.professionalRepository.getById(professionalPersonId);
    if (!professional) {
      throw new PersonNotFoundError();
    }
    const user = await this.userRepository.getById(userPersonId);
    if (!user) {
      throw new PersonNotFoundError();
    }
    const schedule = await this.scheduleRepository.getById(scheduleId);
    if (!schedule) {
      throw new ResourceNotFoundError();
    }
    const validation = validateDateTime(date, hour);
    if (!validation.isValid || !validation.dateTimeObj) {
      throw new InvalidParametersError();
    }
    const { dateTimeObj } = validation;
    const hourly = await this.hourlyRepository.getHourlyByDateAndHour(
      dateTimeObj,
      hour
    );
    if (!hourly) {
      throw new ResourceNotFoundError();
    }
    if (hourly.date < /* @__PURE__ */ new Date()) {
      throw new DateNotValidError();
    }
    const scheduling = await this.schedulingRepository.create({
      hourlyId: hourly.id,
      professionalPersonId,
      userPersonId
    });
    await this.hourlyRepository.updateStatusOcuped(hourly.id);
    return { scheduling };
  }
};

// src/factories/scheduling/create-scheduling-use-case.ts
function makeCreateSchedulingUseCase() {
  const primsaScheduleRepository = new PrismaScheduleRepository();
  const prismaSchedulingRepository = new PrismaSchedulingRepository();
  const prismaHourlyRepository = new PrismaHourlyRepository();
  const prismaProfessionalRepository = new PrismaProfessionalRepository();
  const prismaUserRepository = new PrismaUserRepository();
  const createSchedulingUseCase = new CreateSchedulingUseCase(
    primsaScheduleRepository,
    prismaSchedulingRepository,
    prismaHourlyRepository,
    prismaProfessionalRepository,
    prismaUserRepository
  );
  return createSchedulingUseCase;
}

// src/http/controllers/scheduling/create-scheduling.ts
var import_zod12 = __toESM(require("zod"));
var createScheduling = async (app2) => {
  app2.post(
    "/schedulings",
    {
      schema: {
        tags: ["Schedulings"],
        body: import_zod12.default.object({
          professionalPersonId: import_zod12.default.string(),
          userPersonId: import_zod12.default.string(),
          scheduleId: import_zod12.default.string(),
          hour: import_zod12.default.string(),
          date: import_zod12.default.string()
        }),
        response: {
          201: import_zod12.default.void(),
          404: import_zod12.default.object({ message: import_zod12.default.string() }),
          406: import_zod12.default.object({ message: import_zod12.default.string() }),
          500: import_zod12.default.object({ message: import_zod12.default.string() })
        }
      }
    },
    async (request, reply) => {
      const { professionalPersonId, userPersonId, scheduleId, hour, date } = request.body;
      const createSchedulingUseCase = makeCreateSchedulingUseCase();
      try {
        await createSchedulingUseCase.execute({
          professionalPersonId,
          userPersonId,
          scheduleId,
          hour,
          date
        });
        return reply.status(201).send();
      } catch (error) {
        if (error instanceof PersonNotFoundError || error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }
        if (error instanceof InvalidParametersError) {
          return reply.status(406).send({ message: error.message });
        }
        return reply.status(500).send({ message: "Internal server error." });
      }
    }
  );
};

// src/use-cases/scheduling/get-by-user-id.ts
var GetSchedulingUseCase = class {
  constructor(schedulingRepository, personRepository, hourlyRepository) {
    this.schedulingRepository = schedulingRepository;
    this.personRepository = personRepository;
    this.hourlyRepository = hourlyRepository;
  }
  async execute({
    userId
  }) {
    const scheduling = await this.schedulingRepository.getByUserId(userId);
    if (!scheduling) {
      throw new ResourceNotFoundError();
    }
    const professional = await this.personRepository.findById(
      scheduling.professionalPersonId
    );
    if (!professional) {
      throw new ResourceNotFoundError();
    }
    const hourly = await this.hourlyRepository.getById(scheduling.hourlyId);
    if (!hourly) {
      throw new ResourceNotFoundError();
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
        uf: professional.uf
      }
    };
    return { schedulingDetails };
  }
};

// src/factories/scheduling/make-get-scheduling-use-case.ts
function makeGetSchedulingUseCase() {
  const prismaSchedulingRepository = new PrismaSchedulingRepository();
  const prismaPersonRepository = new PrismaPersonRepository();
  const prismaHourlyRepository = new PrismaHourlyRepository();
  const getSchedulingUseCase = new GetSchedulingUseCase(
    prismaSchedulingRepository,
    prismaPersonRepository,
    prismaHourlyRepository
  );
  return getSchedulingUseCase;
}

// src/http/controllers/scheduling/get-by-user-id.ts
var import_zod13 = __toESM(require("zod"));
var getSchedulingByUserId = async (app2) => {
  app2.get(
    "/schedulings/:userId",
    {
      schema: {
        tags: ["Schedulings"],
        params: import_zod13.default.object({
          userId: import_zod13.default.uuid()
        }),
        response: {
          200: import_zod13.default.object({
            schedulingDetails: import_zod13.default.object({
              id: import_zod13.default.string(),
              nameProfessional: import_zod13.default.string(),
              phoneProfessional: import_zod13.default.string(),
              emailProfessional: import_zod13.default.string(),
              date: import_zod13.default.date(),
              hour: import_zod13.default.string(),
              address: import_zod13.default.object({
                street: import_zod13.default.string(),
                neighborhood: import_zod13.default.string(),
                complement: import_zod13.default.string(),
                cep: import_zod13.default.string(),
                city: import_zod13.default.string(),
                uf: import_zod13.default.string()
              })
            })
          }),
          404: import_zod13.default.object({
            message: import_zod13.default.string()
          }),
          500: import_zod13.default.object({
            message: import_zod13.default.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { userId } = request.params;
      const getSchedulingUseCase = makeGetSchedulingUseCase();
      try {
        const { schedulingDetails } = await getSchedulingUseCase.execute({
          userId
        });
        return reply.status(200).send({ schedulingDetails });
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    }
  );
};

// src/http/controllers/scheduling/routes.ts
function schedulingRoutes(app2) {
  app2.register(createScheduling);
  app2.register(getSchedulingByUserId);
}

// src/app.ts
var app = (0, import_fastify.default)().withTypeProvider();
app.register(import_cors.default, {
  origin: true
});
app.setSerializerCompiler(import_fastify_type_provider_zod.serializerCompiler);
app.setValidatorCompiler(import_fastify_type_provider_zod.validatorCompiler);
app.register(import_swagger.default, {
  openapi: {
    info: {
      title: "MindHelping API \u{1F9E0}",
      version: "1.0.1"
    }
  },
  transform: import_fastify_type_provider_zod.jsonSchemaTransform
});
app.register(import_swagger_ui.default, {
  routePrefix: "/docs"
});
app.register(personRoutes);
app.register(routesProfessional);
app.register(routesGoal);
app.register(hourliesRoutes);
app.register(scheduleRoutes);
app.register(schedulingRoutes);
app.register(feelingsUserRoutes);

// src/env.ts
var import_zod14 = require("zod");
var envSchema = import_zod14.z.object({
  PORT: import_zod14.z.coerce.number()
});
var env = envSchema.parse(process.env);

// src/server.ts
app.listen({
  port: env.PORT,
  host: "0.0.0.0"
}).then(() => {
  console.log("HTTP Server running \u{1F985}");
});
