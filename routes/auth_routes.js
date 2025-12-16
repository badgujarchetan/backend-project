import { Router } from "express";
import {
  loginUserController,
  registerUserController,
} from "../controllers/auth_controller.js";
import { validateMiddleware } from "../middlewares/validator_middlewares.js";
import {
  registeUserValidator,
  loginUserValidator,
} from "../validators/index.js";
const router = Router();

router.post(
  "/register",
  registeUserValidator(),
  validateMiddleware,
  registerUserController
);

router.post(
  "/login",
  loginUserValidator(),
  validateMiddleware,
  loginUserController
);
export default router;
