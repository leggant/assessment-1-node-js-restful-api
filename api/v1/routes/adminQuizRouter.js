import { Router } from "express";
import PATHS from "../constants/paths.js";
import CreateSchema from "../schemas/admin-new-quiz-schema.js";
import UpdateQuizSchema from "../schemas/admin-update-quiz-schema.js";
import validateSchema from "../middleware/mw_validateSchema.js";

import {
  ctCreateQuiz,
  ctGetAllQuizzes,
  ctGetQuizById,
  ctUpdateQuizById,
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

router.put(
  PATHS.ADMIN.QUIZQUERY,
  mwAuth,
  UpdateQuizSchema,
  validateSchema,
  mwTokenValid,
  mwAdminUser,
  ctUpdateQuizById,
);

router.delete(
  PATHS.ADMIN.QUIZQUERY,
  mwAuth,
  mwTokenValid,
  mwAdminUser,
  ctDeleteQuizById,
);

export default router;
