"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feelingsUserRoutes = feelingsUserRoutes;
const create_1 = require("./create");
const get_feelings_by_date_user_1 = require("./get-feelings-by-date-user");
function feelingsUserRoutes(app) {
    app.register(create_1.createFeelingsUser);
    app.register(get_feelings_by_date_user_1.getFeelingsByDateUser);
}
