"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ejs_1 = __importDefault(require("ejs"));
const index_1 = require("./../views/index");
const app_1 = __importDefault(require("../../config/app"));
const user_1 = __importDefault(require("./user"));
const journey_1 = __importDefault(require("./journey"));
const order_1 = __importDefault(require("./order"));
const router = (0, express_1.Router)();
router.get("/", (req, res, next) => {
    return res.send(ejs_1.default.render(index_1.index, {
        title: "ThirdFriend",
        version: app_1.default.app.api_version.toUpperCase(),
    }));
});
router.use(user_1.default);
router.use(journey_1.default);
router.use(order_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map