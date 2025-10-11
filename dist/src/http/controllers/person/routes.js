"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.personRoutes = personRoutes;
const authenticate_1 = require("./authenticate");
const get_me_user_1 = require("./get-me-user");
const get_user_by_id_1 = require("./get-user-by-id");
const register_professional_1 = require("./register-professional");
const register_user_1 = require("./register-user");
async function personRoutes(app) {
    app.register(register_professional_1.registerProfessional);
    app.register(register_user_1.registerUser);
    app.register(authenticate_1.authenticate);
    app.register(get_me_user_1.getMeUser);
    app.register(get_user_by_id_1.getUserById);
}
