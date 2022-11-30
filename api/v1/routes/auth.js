import { Router } from "express";
import { register, login } from "../controllers/auth_controller.js";
import PATHS from "../constants/paths.js";

const router = Router();

router.route(PATHS.REGISTER).post(register);
router.route(PATHS.LOGIN).post(login);

export default router;
