"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.server = void 0;
// third party modules
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const http = __importStar(require("http"));
const socketio = __importStar(require("socket.io"));
// routes
const index_1 = __importDefault(require("./routes/index"));
// config
const app_1 = __importDefault(require("../config/app"));
const path_1 = __importDefault(require("path"));
// middlewares
const errorHandlerMiddleware_1 = __importDefault(require("./middlewares/errorHandlerMiddleware"));
const errorHandlerMiddleware_2 = __importDefault(require("./middlewares/errorHandlerMiddleware"));
class App {
    constructor() {
        this.mongoUrl = app_1.default.db.mongo_connection_string;
        this.mongoOptions = {};
        this.app = (0, express_1.default)();
        this.config();
        this.initializeErrorHandling();
        this.mongoSetup();
        this.app.use("/" + app_1.default.app.api_version, index_1.default);
        this.app.use(errorHandlerMiddleware_1.default);
        this.app.use((req, res, next) => {
            return res.status(404).send();
        });
        this.handlingUnCaughtRejections();
        this.server = http.createServer(this.app);
        this.io = new socketio.Server(this.server, {
            cors: {
                origin: "*"
            }
        });
    }
    config() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.static("public"));
        this.app.set("views", path_1.default.join(__dirname, "views"));
        this.app.set("view engine", "ejs");
        this.app.use((0, morgan_1.default)("dev"));
        this.app.use((0, helmet_1.default)());
        this.app.use(body_parser_1.default.json({ limit: "5mb" }));
        this.app.use(body_parser_1.default.urlencoded({ limit: "5mb", extended: true }));
    }
    mongoSetup() {
        mongoose_1.default.connect(this.mongoUrl, this.mongoOptions)
            .then(() => {
            console.info("Successfully connected mongoose");
        })
            .catch((err) => {
            console.error("Error while connecting to mongoose", err);
        });
    }
    initializeErrorHandling() {
        this.app.use(errorHandlerMiddleware_2.default);
    }
    handlingUnCaughtRejections() {
        process.on("unhandledRejection", function (err) {
            // Todo - add sentry log here
            console.log("unhandledRejection", err);
            process.exit(1);
        });
        process.on("uncaughtException", function (err) {
            // Todo - add sentry log here
            console.log("uncaughtException", err);
            process.exit(1);
        });
    }
}
const app = new App();
exports.server = app.server;
exports.io = app.io;
// export default new App().app;
//# sourceMappingURL=app.js.map