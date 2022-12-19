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
import mwUserProfileQuery from "../middleware/mw_userProfile.js";

const router = Router();

router.get(PATHS.USERDETAILS.USER, mwAuth, mwUserProfileQuery, ctGetUser);
router.get(
  PATHS.USERDETAILS.ADMINUSERSEARCH,
  mwAuth,
  mwUserProfileQuery,
  ctGetUser,
);

// router.put(
//   PATHS.USERDETAILS.USER,
//   mwAuth,
//   UpdateSchema,
//   validateSchema,
//   mwUserProfileQuery,
//   updateUser,
// );
// router.delete(PATHS.USERDETAILS.USER, mwAuth, mwUserProfileQuery, deleteUser);

// router.get(PATHS.USERDETAILS.USERNAME, mwAuth, mwUserProfileQuery, getUser);
// router.get(PATHS.USERDETAILS.USEREMAIL, mwAuth, mwUserProfileQuery, getUser);
// router.put(
//   PATHS.USERDETAILS.USERNAME,
//   mwAuth,
//   UpdateSchema,
//   validateSchema,
//   mwUserProfileQuery,
//   updateUser,
// );
// router.put(
//   PATHS.USERDETAILS.USEREMAIL,
//   mwAuth,
//   UpdateSchema,
//   validateSchema,
//   mwUserProfileQuery,
//   updateUser,
// );
// router.delete(
//   PATHS.USERDETAILS.USERNAME,
//   mwAuth,
//   mwUserProfileQuery,
//   deleteUser,
// );
// router.delete(
//   PATHS.USERDETAILS.USEREMAIL,
//   mwAuth,
//   mwUserProfileQuery,
//   deleteUser,
// );

export default router;
