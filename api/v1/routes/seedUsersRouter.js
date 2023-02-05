import { Router } from "express";
import PATHS from "../constants/paths.js";
import { seedUsers } from "../controllers/userSeederController.js";
import mwAuth from "../middleware/mw_authentication.js";
import mwAdminUser from "../middleware/mw_adminUser.js";
import mwTokenValid from "../middleware/mw_tokenValid.js";

const userSeederRouter = Router();

userSeederRouter.get(
  `${PATHS.ADMIN.ADMINSEEDER}`,
  mwAuth,
  mwTokenValid,
  mwAdminUser,
  seedUsers,
);

export default userSeederRouter;
