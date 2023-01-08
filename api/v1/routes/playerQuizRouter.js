import { Router } from "express";
import PATHS from "../constants/paths.js";
import validateSchema from "../middleware/mw_validateSchema.js";

import {
  ctAddQuizPlayer,
  ctSubmitQuizAnswers,
  ctGetPlayersIncompleteQuizzes,
} from "../controllers/quizPlayerController.js";

import mwAuth from "../middleware/mw_authentication.js";
import mwTokenValid from "../middleware/mw_tokenValid.js";
import mwQuizPlayerValid from "../middleware/mw_quizPlayerValid.js";
import PlayerSubmitQuizAnswersSchema from "../schemas/player-answer-question-schema.js";

const router = Router();

router.get(
  PATHS.QUIZ.PLAYERUNFINISHEDQUIZZES,
  mwAuth,
  mwTokenValid,
  ctGetPlayersIncompleteQuizzes,
);

router.post(
  PATHS.QUIZ.PLAYER,
  mwAuth,
  mwTokenValid,
  mwQuizPlayerValid,
  ctAddQuizPlayer,
);

router.post(
  PATHS.QUIZ.SUBMITANSWERS,
  mwAuth,
  mwTokenValid,
  mwQuizPlayerValid,
  PlayerSubmitQuizAnswersSchema,
  validateSchema,
  ctSubmitQuizAnswers,
);

export default router;
