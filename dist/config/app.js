"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// load the correct env file based on the NODE_ENV value passed during the npm command
dotenv_1.default.config({ path: `.env.${process.env.NODE_ENV}` });
// set up data
const appData = {
    port: process.env.PORT,
    api_version: process.env.API_VERSION,
    auto_logout_in_min: 30,
    ui_app_base_url: process.env.APP_URL,
    password_expire_in_days: process.env.PASSWORD_EXPIRE_IN_DAYS || 90,
};
const DB = {
    mongo_connection_string: process.env.MONGO_CONNECTION_STRING,
};
const GOOGLE_API = {
    google_client_id: process.env.CLIENT_ID,
    google_client_secret: process.env.CLIENT_SECRET,
    google_redirect_uri: process.env.REDIRECT_URI
};
// load different jwt secrets based on the NODE_ENV value passed during the npm command
const env = process.env.NODE_ENV;
var JWTData = null;
switch (env) {
    case "dev":
        JWTData = {
            token_secret: "54a6dd58870e4d81b2ec7fd91fb30db8",
            token_life: 604800, // in seconds - 1 Hr
            refresh_token_secret: "7208d26ac5a64c108d67878f5eda3255",
            refresh_token_life: 604800, // in seconds - 7 Days,
            patient_portal_token_refresh_life: 60000,
        };
        break;
    case "prod":
        JWTData = {
            token_secret: "0da53d14b60c410fb778b7a10603ee61",
            token_life: 604800, // in seconds - 1 Hr
            refresh_token_secret: "f64f4684dbb94d6197414369de20cf09",
            refresh_token_life: 604800, // in seconds - 7 Days
            patient_portal_token_refresh_life: 60000,
        };
        break;
}
const configData = {
    app: appData,
    db: DB,
    jwt: JWTData,
    google: GOOGLE_API
};
exports.default = configData;
//# sourceMappingURL=app.js.map