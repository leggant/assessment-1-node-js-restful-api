import { Router } from "express";
import PATHS from "../constants/paths.js";
import UpdateSchema from "../schemas/update-user-schema.js";
import validateSchema from "../middleware/mw_validateSchema.js";
import {
  ctGetUser,
  ctUpdateUser,
  ctDeleteUser,
} from "../controllers/user_profile_controller.js";

import mwAuth from "../middleware/mw_authentication.js";
import mwAdminUser from "../middleware/mw_adminUser.js";
import mwUserProfileQuery from "../middleware/mw_userProfile.js";

const router = Router();

// basic users
router.get(PATHS.USERDETAILS.USER, mwAuth, mwUserProfileQuery, ctGetUser);
router.put(
  PATHS.USERDETAILS.USER,
  mwAuth,
  UpdateSchema,
  validateSchema,
  mwUserProfileQuery,
  ctUpdateUser,
);
router.delete(PATHS.USERDETAILS.USER, mwAuth, mwUserProfileQuery, ctDeleteUser);

// admin users
router.get(
  PATHS.USERDETAILS.ADMINUSERSEARCH,
  mwAuth,
  mwAdminUser,
  mwUserProfileQuery,
  ctGetUser,
);
router.put(
  PATHS.USERDETAILS.ADMINUSERSEARCH,
  mwAuth,
  mwAdminUser,
  UpdateSchema,
  validateSchema,
  mwUserProfileQuery,
  ctGetUser,
);
router.delete(
  PATHS.USERDETAILS.ADMINUSERSEARCH,
  mwAuth,
  mwAdminUser,
  mwUserProfileQuery,
  ctDeleteUser,
);

export default router;
