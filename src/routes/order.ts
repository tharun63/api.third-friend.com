import { Router } from "express";
import { SchemaValidator } from "../middlewares/validations/schemaValidator";
import authMiddleware from "../middlewares/authMiddleware";
import { OrderController } from "../controllers/orderController";


const schemaValidator: SchemaValidator = new SchemaValidator(true);
const validateRequest = schemaValidator.validate();


const orderController = new OrderController();

const router: Router = Router();

router.post(
'/order',
[
    authMiddleware.checkAuthHeader,
    authMiddleware.validateAccessToken,   
    validateRequest,
],
orderController.order.bind(orderController));
router.post('/webhook',orderController.webHook.bind(orderController));

export default router;
