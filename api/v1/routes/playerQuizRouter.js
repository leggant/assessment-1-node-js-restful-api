import { Router } from "express";
import PATHS from "../constants/paths.js";
import validateSchema from "../middleware/mw_validateSchema.js";

import { ctAddQuizPlayer } from "../controllers/quizPlayerController.js";

import mwAuth from "../middleware/mw_authentication.js";
import mwTokenValid from "../middleware/mw_tokenValid.js";
import mwQuizPlayerValid from "../middleware/mw_quizPlayerValid.js";

const router = Router();

router.post(
  PATHS.QUIZ.PLAYER,
  mwAuth,
  mwTokenValid,
  mwQuizPlayerValid,
  // AddPlayerToQuizSchema,
  // validateSchema,
  ctAddQuizPlayer,
);

export default router;
