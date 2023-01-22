import { Router } from "express";
import PATHS from "../constants/paths.js";
import UpdateSchema from "../schemas/update-user-schema.js";
import validateSchema from "../middleware/mw_validateSchema.js";
import {
  ctGetUser,
  ctUpdateUser,
  ctDeleteUser,
} from "../controllers/userProfileController.js";

import mwAuth from "../middleware/mw_authentication.js";
import mwAdminUser from "../middleware/mw_adminUser.js";
import mwTokenValid from "../middleware/mw_tokenValid.js";
import mwUserProfileQuery from "../middleware/mw_userProfile.js";

const router = Router();

// basic users
router.get(
  PATHS.USER.PROFILE,
  mwAuth,
  mwTokenValid,
  mwUserProfileQuery,
  ctGetUser,
);
router.put(
  PATHS.USER.PROFILE,
  mwAuth,
  mwTokenValid,
  UpdateSchema,
  validateSchema,
  mwUserProfileQuery,
  ctUpdateUser,
);
router.delete(
  PATHS.USER.PROFILE,
  mwAuth,
  mwTokenValid,
  mwUserProfileQuery,
  ctDeleteUser,
);

// admin users
router.get(
  PATHS.ADMIN.USERSEARCH,
  mwAuth,
  mwTokenValid,
  mwAdminUser,
  mwUserProfileQuery,
  ctGetUser,
);
router.put(
  PATHS.ADMIN.USERSEARCH,
  mwAuth,
  mwTokenValid,
  mwAdminUser,
  UpdateSchema,
  validateSchema,
  mwUserProfileQuery,
  ctGetUser,
);
router.delete(
  PATHS.ADMIN.USERSEARCH,
  mwAuth,
  mwTokenValid,
  mwAdminUser,
  mwUserProfileQuery,
  ctDeleteUser,
);

export default router;
