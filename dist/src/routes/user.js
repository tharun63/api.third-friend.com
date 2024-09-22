"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const schemaValidator_1 = require("../middlewares/validations/schemaValidator");
const passportMiddleware_1 = __importDefault(require("../middlewares/passportMiddleware"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const customValidationMiddleware_1 = require("../middlewares/customValidationMiddleware");
const googleAuthController_1 = require("../controllers/googleAuthController");
const orderController_1 = require("../controllers/orderController");
const accessControlMiddleware_1 = require("../middlewares/accessControlMiddleware");
const schemaValidator = new schemaValidator_1.SchemaValidator(true);
const validateRequest = schemaValidator.validate();
const userController = new user_1.UserController();
const googleAuthController = new googleAuthController_1.GoogleAuthController();
const orderController = new orderController_1.OrderController();
const accessControlMiddleware = new accessControlMiddleware_1.AccessControlMiddleware();
const customValidationMiddleware = new customValidationMiddleware_1.CustomValidationMiddleware();
const router = (0, express_1.Router)();
router.post("/signin", validateRequest, 
// customValidationMiddleware.verifyRecaptcha,
passportMiddleware_1.default.authenticate("login", {
    session: false,
    failWithError: true,
}), authMiddleware_1.default.checkUserStatus, userController.signIn, (err, req, res, next) => {
    const respData = {
        success: false,
        message: "Invalid Credentials!",
    };
    return res.status(err.status).json(respData);
});
router.post("/signup", [
    validateRequest,
    customValidationMiddleware.checkEmailExists,
    // customValidationMiddleware.verifyRecaptcha,
], userController.signUp);
router.post("/forgot-password", [validateRequest, authMiddleware_1.default.checkUserByEmail], userController.forgotPassword);
router.post('/forgot-password/verify', [
    validateRequest,
    authMiddleware_1.default.verifyUser,
], userController.verifyForgotPassword);
router.post('/reset-password', [
    validateRequest,
    authMiddleware_1.default.verifyUser,
], userController.resetPassword);
router.patch("/password/update", [
    validateRequest,
    authMiddleware_1.default.checkAuthHeader,
    authMiddleware_1.default.validateAccessToken,
    customValidationMiddleware.checkCurrentPasswordIsCorrect,
], userController.updatePassword);
router.get("/users", [
    validateRequest,
    authMiddleware_1.default.checkAuthHeader,
    authMiddleware_1.default.validateAccessToken,
    accessControlMiddleware.isAllowedToAccessUsers,
    customValidationMiddleware.parseSkipAndLimitAndSortParams,
], userController.getAllUsers);
router.get("/users/:id", [authMiddleware_1.default.checkAuthHeader, authMiddleware_1.default.validateAccessToken], userController.getUserById);
router.get('/auth/google', googleAuthController.googleAuth);
router.get('/auth/google/callback', googleAuthController.googleAuthCallback);
// router.get(
//   "/profile",
//   [authMiddleware.checkAuthHeader, authMiddleware.validateAccessToken],
//   userController.getProfile
// );
// router.patch(
//   "/profile",
//   [
//     validateRequest,
//     authMiddleware.checkAuthHeader,
//     authMiddleware.validateAccessToken,
//   ],
//   userController.updateProfile
// );
// router.post(
//   "/users",
//   [
//     validateRequest,
//     authMiddleware.checkAuthHeader,
//     authMiddleware.validateAccessToken,
//   ],
//   userController.AddUser
// );
exports.default = router;
//# sourceMappingURL=user.js.map