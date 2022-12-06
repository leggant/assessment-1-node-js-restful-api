/* eslint-disable import/no-import-module-exports */
import express, { Router } from "express";
import PATHS from "../constants/paths.js";
import { register, login } from "../controllers/auth_controller.js";
import registerSchema from "../schemas/register-user-schema.js";
import validateSchema from "../middleware/mw_validateSchema.js";

const router = Router();

router.post(PATHS.REGISTER, registerSchema, validateSchema, register);
router.post(PATHS.LOGIN, login);

export default router;
