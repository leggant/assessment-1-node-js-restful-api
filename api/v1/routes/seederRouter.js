import { Router } from "express";
import PATHS from "../constants/paths.js";
import mwAuth from "../middleware/mw_authentication.js";
import mwAdminUser from "../middleware/mw_adminUser.js";
import mwTokenValid from "../middleware/mw_tokenValid.js";
import { seedUsers } from "../controllers/userSeederController.js";
import { seedQuizCategories } from "../controllers/categorySeederContoller.js";

const seederRouter = Router();

seederRouter.get(
  `${PATHS.ADMIN.PLAYERSEEDER}`,
  mwAuth,
  mwTokenValid,
  mwAdminUser,
  seedUsers,
);

seederRouter.get(
  `${PATHS.ADMIN.CATEGORYSEEDER}`,
  mwAuth,
  mwTokenValid,
  mwAdminUser,
  seedQuizCategories,
);

export default seederRouter;
