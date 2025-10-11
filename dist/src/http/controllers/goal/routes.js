"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routesGoal = routesGoal;
const add_counter_1 = require("./add-counter");
const create_1 = require("./create");
const delete_1 = require("./delete");
const execute_goal_1 = require("./execute-goal");
const fetch_many_1 = require("./fetch-many");
const update_1 = require("./update");
function routesGoal(app) {
    app.register(create_1.create);
    app.register(delete_1.deleteGoal);
    app.register(execute_goal_1.executeGoal);
    app.register(fetch_many_1.fechMany);
    app.register(update_1.update);
    app.register(add_counter_1.addCounter);
}
