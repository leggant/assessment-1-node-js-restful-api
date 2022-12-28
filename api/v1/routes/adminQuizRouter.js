import { Router } from "express";
import PATHS from "../constants/paths.js";
import CreateSchema from "../schemas/admin-new-quiz-schema.js";
import validateSchema from "../middleware/mw_validateSchema.js";

import { ctCreateQuiz } from "../controllers/quizAdminController.js";

import mwAuth from "../middleware/mw_authentication.js";
import mwAdminUser from "../middleware/mw_adminUser.js";
import mwTokenValid from "../middleware/mw_tokenValid.js";

const router = Router();

router.post(
  PATHS.ADMIN.QUIZ,
  mwAuth,
  CreateSchema,
  validateSchema,
  mwTokenValid,
  mwAdminUser,
  ctCreateQuiz,
);

// // admin users
// router.get(
//   PATHS.ADMIN.USERSEARCH,
//   mwAuth,
//   mwTokenValid,
//   mwAdminUser,
//   mwUserProfileQuery,
//   ctGetUser,
// );
// router.put(
//   PATHS.ADMIN.USERSEARCH,
//   mwAuth,
//   mwTokenValid,
//   mwAdminUser,
//   UpdateSchema,
//   validateSchema,
//   mwUserProfileQuery,
//   ctGetUser,
// );
// router.delete(
//   PATHS.ADMIN.USERSEARCH,
//   mwAuth,
//   mwAdminUser,
//   mwUserProfileQuery,
//   mwTokenValid,
//   ctDeleteUser,
// );

export default router;
