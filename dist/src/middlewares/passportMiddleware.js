"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const user_1 = require("../services/database/user");
const userDataServiceProvider = new user_1.UserDataServiceProvider();
passport_1.default.use('login', new passport_local_1.Strategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, done) => {
    try {
        let user = await userDataServiceProvider.login(email, password);
        if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    }
    catch (error) {
        done(error);
    }
}));
exports.default = passport_1.default;
//# sourceMappingURL=passportMiddleware.js.map