import { Router } from "express";
import PATHS from "../constants/paths.js";

import { getUserData } from "../controllers/user_controller.js";

import mwAuth from "../middleware/mw_authentication.js";
import mwUser from "../middleware/mw_user.js";

const router = Router();

router.get(PATHS.USER.USERDETAILS, mwAuth, mwUser, getUserData);

export default router;
