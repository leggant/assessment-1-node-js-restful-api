import { Router } from "express";
import PATHS from "../constants/paths.js";
import CreateSchema from "../schemas/admin-new-quiz-schema.js";
import validateSchema from "../middleware/mw_validateSchema.js";

import {
  ctCreateQuiz,
  ctGetAllQuizzes,
  ctGetQuizById,
  ctDeleteQuizById,
} from "../controllers/quizAdminController.js";

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

router.get(
  PATHS.ADMIN.QUIZ,
  mwAuth,
  mwTokenValid,
  mwAdminUser,
  ctGetAllQuizzes,
);

router.get(
  PATHS.ADMIN.QUIZQUERY,
  mwAuth,
  mwTokenValid,
  mwAdminUser,
  ctGetQuizById,
);

router.delete(
  PATHS.ADMIN.QUIZQUERY,
  mwAuth,
  mwTokenValid,
  mwAdminUser,
  ctDeleteQuizById,
);

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
