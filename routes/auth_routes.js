import { Router } from "express";
import {
  getCurrentuser,
  loginUserController,
  logOutUser,
  registerUserController,
} from "../controllers/auth_controller.js";
import { validateMiddleware } from "../middlewares/validator_middlewares.js";
import {
  registeUserValidator,
  loginUserValidator,
} from "../validators/index.js";
import { authJWTVerify } from "../middlewares/auth_middlewares.js";
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
router.get("/logout", authJWTVerify, logOutUser);
router.get("/current-user", authJWTVerify, getCurrentuser);
export default router;
