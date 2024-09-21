"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const app_2 = __importDefault(require("../config/app"));
app_1.io.on("connection", (data) => {
    // console.log("connected to SocketIo")
});
app_1.server.listen(app_2.default.app.port, () => {
    console.log("Express server listening on port " + app_2.default.app.port);
});
//# sourceMappingURL=server.js.map