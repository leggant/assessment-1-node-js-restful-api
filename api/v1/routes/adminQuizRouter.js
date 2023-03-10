import { Router } from "express";
import PATHS from "../constants/paths.js";

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
import validateSchema from "../middleware/mw_validateSchema.js";

import QuizParamSchema from "../schemas/param-quiz-schema.js";
import CreateSchema from "../schemas/admin-new-quiz-schema.js";
import UpdateQuizSchema from "../schemas/admin-update-quiz-schema.js";

const router = Router();

router.post(
  PATHS.ADMIN.QUIZ,
  mwAuth,
  mwTokenValid,
  mwAdminUser,
  CreateSchema,
  validateSchema,
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
  QuizParamSchema,
  validateSchema,
  mwTokenValid,
  mwAdminUser,
  ctGetQuizById,
);

router.put(
  PATHS.ADMIN.QUIZQUERY,
  mwAuth,
  QuizParamSchema,
  validateSchema,
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
  QuizParamSchema,
  validateSchema,
  mwAdminUser,
  ctDeleteQuizById,
);

export default router;
