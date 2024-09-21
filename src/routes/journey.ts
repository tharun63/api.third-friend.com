import { Router } from "express";
import { JourneyController } from "../controllers/journeyController";
import { SchemaValidator } from "../middlewares/validations/schemaValidator";
import authMiddleware from "../middlewares/authMiddleware";
import { CustomValidationMiddleware } from "../middlewares/customValidationMiddleware";



const schemaValidator: SchemaValidator = new SchemaValidator(true);
const validateRequest = schemaValidator.validate();


const journeyController = new JourneyController();


const customValidationMiddleware = new CustomValidationMiddleware();


const router: Router = Router();


router.post(
  "/journey",
  [
    validateRequest,
    authMiddleware.checkAuthHeader,
    authMiddleware.validateAccessToken,
    customValidationMiddleware.checkEmailExists,
  ],
  journeyController.AddJourney
);

router.patch(
  "/journey/:journey_id",
  [
    validateRequest,
    authMiddleware.checkAuthHeader,
    authMiddleware.validateAccessToken,
  ],
  journeyController.updateJourney
);

router.get(
    "/journey/:journey_id",
    [authMiddleware.checkAuthHeader, authMiddleware.validateAccessToken],
    journeyController.getJourneyById
);

router.delete(
    "/journey/:journey_id",
  [
   validateRequest,
   authMiddleware.checkAuthHeader,
   authMiddleware.validateAccessToken,
  ],
  journeyController.deleteJourney
)


router.get(
  "/journeys",
  [
    validateRequest,
    authMiddleware.checkAuthHeader,
    authMiddleware.validateAccessToken,
    customValidationMiddleware.parseSkipAndLimitAndSortParams,
  ],
  journeyController.getAllJourneys
);


export default router;
