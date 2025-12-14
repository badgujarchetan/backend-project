import { Router } from "express";
import { healthCheck } from "../controllers/healthcheck_controller.js";
const router = Router();

router.get("/", healthCheck);


export default router