import { Router } from "express";
import PATHS from "../constants/paths.js";
import UpdateSchema from "../schemas/update-user-schema.js";
import validateSchema from "../middleware/mw_validateSchema.js";
import {
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user_controller.js";

import mwAuth from "../middleware/mw_authentication.js";
import mwUser from "../middleware/mw_user.js";

const router = Router();

router.get(PATHS.USERDETAILS.USER, mwAuth, mwUser, getUser);
router.put(
  PATHS.USERDETAILS.USER,
  mwAuth,
  UpdateSchema,
  validateSchema,
  mwUser,
  updateUser,
);
router.delete(PATHS.USERDETAILS.USER, mwAuth, mwUser, deleteUser);

router.get(PATHS.USERDETAILS.USERNAME, mwAuth, mwUser, getUser);
router.get(PATHS.USERDETAILS.USEREMAIL, mwAuth, mwUser, getUser);
router.put(
  PATHS.USERDETAILS.USERNAME,
  mwAuth,
  UpdateSchema,
  validateSchema,
  mwUser,
  updateUser,
);
router.put(
  PATHS.USERDETAILS.USEREMAIL,
  mwAuth,
  UpdateSchema,
  validateSchema,
  mwUser,
  updateUser,
);
router.delete(PATHS.USERDETAILS.USERNAME, mwAuth, mwUser, deleteUser);
router.delete(PATHS.USERDETAILS.USEREMAIL, mwAuth, mwUser, deleteUser);

export default router;
