import { Router } from "express";
import { UserController } from "../controllers/user";
import { SchemaValidator } from "../middlewares/validations/schemaValidator";
import passportMiddleware from "../middlewares/passportMiddleware";
import authMiddleware from "../middlewares/authMiddleware";
import { CustomValidationMiddleware } from "../middlewares/customValidationMiddleware";
import { GoogleAuthController } from '../controllers/googleAuthController';


const schemaValidator: SchemaValidator = new SchemaValidator(true);
const validateRequest = schemaValidator.validate();


const userController = new UserController();
const customValidationMiddleware = new CustomValidationMiddleware();
const googleAuthController = new GoogleAuthController();


const router: Router = Router();

router.post(
  "/signin",
  validateRequest,
  passportMiddleware.authenticate("login", {
    session: false,
    failWithError: true,
  }),
  authMiddleware.checkUserStatus,
  userController.signIn,
  (err, req, res, next) => {
    const respData = {
      success: false,
      message: "Invalid Credentials!",
    };
    return res.status(err.status).json(respData);
  }
);
router.post(
  "/signup",
  [
    validateRequest,
    customValidationMiddleware.checkEmailExists,
  ],
  userController.signUp
);

router.post(
  "/forgot-password",
  [validateRequest,authMiddleware.checkUserByEmail],
  userController.forgotPassword
);

router.post(
  '/forgot-password/verify',
  [
    validateRequest,
    authMiddleware.verifyUser,
  ],
  userController.verifyForgotPassword
);

router.post(
  '/users/reset-password',
  [
    validateRequest,
    authMiddleware.verifyUser,
  ],
  userController.resetPassword
)

router.get(
  "/profile",
  [authMiddleware.checkAuthHeader, authMiddleware.validateAccessToken],
  userController.getProfile
);

router.patch(
  "/profile",
  [
    validateRequest,
    authMiddleware.checkAuthHeader,
    authMiddleware.validateAccessToken,
  ],
  userController.updateProfile
);

router.patch(
  "/password/update",
  [
    validateRequest,
    authMiddleware.checkAuthHeader,
    authMiddleware.validateAccessToken,
    customValidationMiddleware.checkCurrentPasswordIsCorrect,
  ],
  userController.updatePassword
);

router.post(
  "/users",
  [
    authMiddleware.checkAuthHeader,
    authMiddleware.validateAccessToken,
    validateRequest,
  ],
  userController.AddUser
);


router.get(
  "/users/:id",
  [authMiddleware.checkAuthHeader, authMiddleware.validateAccessToken],
  userController.getUserById
);

router.get('/auth/google', googleAuthController.googleAuth);
router.get('/auth/google/callback', googleAuthController.googleAuthCallback);


export default router;
