import { Router } from "express";
import PATHS from "../constants/paths.js";
import RegisterSchema from "../schemas/register-user-schema.js";
import validateSchema from "../middleware/mw_validateSchema.js";
import { seedUsers } from "../controllers/seeder_controller.js";
import mwAuth from "../middleware/mw_authentication.js";
import mwAdminUser from "../middleware/mw_adminUser.js";

const userSeederRouter = Router();
// user/auth/admin/seeder/users
userSeederRouter.get(
  `${PATHS.ADMIN.ADMINSEEDER}`,
  mwAuth,
  mwAdminUser,
  RegisterSchema,
  validateSchema,
  seedUsers,
);

export default userSeederRouter;
