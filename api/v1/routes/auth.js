import { Router } from "express";
import PATHS from "../constants/paths.js";
import { register, login } from "../controllers/auth_controller.js";
import RegisterSchema from "../schemas/register-user-schema.js";
import LoginSchema from "../schemas/login-user-schema.js";
import validateSchema from "../middleware/mw_validateSchema.js";

const router = Router();

router.post(PATHS.REGISTER, RegisterSchema, validateSchema, register);
router.post(PATHS.LOGIN, LoginSchema, validateSchema, login);

export default router;
