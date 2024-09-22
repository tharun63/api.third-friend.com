import { Router } from "express";
import { UserController } from "../controllers/user";
import { SchemaValidator } from "../middlewares/validations/schemaValidator";
import passportMiddleware from "../middlewares/passportMiddleware";
import authMiddleware from "../middlewares/authMiddleware";
import { CustomValidationMiddleware } from "../middlewares/customValidationMiddleware";
import { GoogleAuthController } from '../controllers/googleAuthController';
import { OrderController } from "../controllers/orderController";
import { AccessControlMiddleware } from "../middlewares/accessControlMiddleware";



const schemaValidator: SchemaValidator = new SchemaValidator(true);
const validateRequest = schemaValidator.validate();


const userController = new UserController();
const googleAuthController = new GoogleAuthController();
const orderController = new OrderController();

const accessControlMiddleware = new AccessControlMiddleware();
const customValidationMiddleware = new CustomValidationMiddleware();


const router: Router = Router();

router.post(
  "/signin",
  validateRequest,
  // customValidationMiddleware.verifyRecaptcha,
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
    // customValidationMiddleware.verifyRecaptcha,
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
  '/reset-password',
  [
    validateRequest,
    authMiddleware.verifyUser,
  ],
  userController.resetPassword
)


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
    validateRequest,
    authMiddleware.checkAuthHeader,
    authMiddleware.validateAccessToken,
    
  ],
  userController.AddUser
);
router.get(
  "/users",
  [
    validateRequest,
    authMiddleware.checkAuthHeader,
    authMiddleware.validateAccessToken,
    accessControlMiddleware.isAllowedToAccessUsers,
    customValidationMiddleware.parseSkipAndLimitAndSortParams,
  ],
  userController.getAllUsers
);


router.get(
  "/users/:id",
  [authMiddleware.checkAuthHeader, authMiddleware.validateAccessToken],
  userController.getUserById
);

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


export default router;
