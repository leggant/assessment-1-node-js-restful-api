import { Router } from "express";
import PATHS from "../constants/paths.js";
import RegisterSchema from "../schemas/register-user-schema.js";
import validateSchema from "../middleware/mw_validateSchema.js";
import { seedUsers } from "../controllers/seeder_controller.js";

const userSeederRouter = Router();

userSeederRouter.post(
  `${PATHS.ADMIN.ADMINSEEDER}`,
  RegisterSchema,
  validateSchema,
  seedUsers,
);

export default userSeederRouter;
