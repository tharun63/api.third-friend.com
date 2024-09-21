"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const journeyController_1 = require("../controllers/journeyController");
const schemaValidator_1 = require("../middlewares/validations/schemaValidator");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const customValidationMiddleware_1 = require("../middlewares/customValidationMiddleware");
const schemaValidator = new schemaValidator_1.SchemaValidator(true);
const validateRequest = schemaValidator.validate();
const journeyController = new journeyController_1.JourneyController();
const customValidationMiddleware = new customValidationMiddleware_1.CustomValidationMiddleware();
const router = (0, express_1.Router)();
router.post("/journey", [
    validateRequest,
    authMiddleware_1.default.checkAuthHeader,
    authMiddleware_1.default.validateAccessToken,
    customValidationMiddleware.checkEmailExists,
], journeyController.AddJourney);
router.patch("/journey/:journey_id", [
    validateRequest,
    authMiddleware_1.default.checkAuthHeader,
    authMiddleware_1.default.validateAccessToken,
], journeyController.updateJourney);
router.get("/journey/:journey_id", [authMiddleware_1.default.checkAuthHeader, authMiddleware_1.default.validateAccessToken], journeyController.getJourneyById);
router.delete("/journey/:journey_id", [
    validateRequest,
    authMiddleware_1.default.checkAuthHeader,
    authMiddleware_1.default.validateAccessToken,
], journeyController.deleteJourney);
router.get("/journeys", [
    validateRequest,
    authMiddleware_1.default.checkAuthHeader,
    authMiddleware_1.default.validateAccessToken,
    customValidationMiddleware.parseSkipAndLimitAndSortParams,
], journeyController.getAllJourneys);
exports.default = router;
//# sourceMappingURL=journey.js.map