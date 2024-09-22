"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const schemaValidator_1 = require("../middlewares/validations/schemaValidator");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const orderController_1 = require("../controllers/orderController");
const schemaValidator = new schemaValidator_1.SchemaValidator(true);
const validateRequest = schemaValidator.validate();
const orderController = new orderController_1.OrderController();
const router = (0, express_1.Router)();
router.post('/order', [
    authMiddleware_1.default.checkAuthHeader,
    authMiddleware_1.default.validateAccessToken,
    validateRequest,
], orderController.order.bind(orderController));
router.post('/webhook', orderController.webHook.bind(orderController));
exports.default = router;
//# sourceMappingURL=order.js.map