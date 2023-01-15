import { Router } from "express";
import PATHS from "../constants/paths.js";
import validateSchema from "../middleware/mw_validateSchema.js";

import {
  ctAddQuizPlayer,
  ctGetQuizQuestions,
  ctSubmitQuizAnswers,
  ctGetPlayersIncompleteQuizzes,
} from "../controllers/quizPlayerController.js";

import mwAuth from "../middleware/mw_authentication.js";
import mwTokenValid from "../middleware/mw_tokenValid.js";
import mwQuizPlayerValid from "../middleware/mw_quizPlayerValid.js";
import mwPlayerAddedToQuiz from "../middleware/mw_playerAddedToQuiz.js";
import mwCurrentDateValid from "../middleware/mw_currentDateValid.js";
import mwQuizValid from "../middleware/mw_quizValid.js";
import PlayerSubmitQuizAnswersSchema from "../schemas/player-submit-answers-schema.js";

const router = Router();

router.get(
  PATHS.QUIZ.PLAYERUNFINISHEDQUIZZES,
  mwAuth,
  mwTokenValid,
  ctGetPlayersIncompleteQuizzes,
);
// add player to a quiz
router.post(
  PATHS.QUIZ.PLAYER,
  mwAuth,
  mwTokenValid,
  mwQuizValid,
  mwQuizPlayerValid,
  ctAddQuizPlayer,
);
// get quiz questions
router.get(
  PATHS.QUIZ.QUESTIONS,
  mwAuth,
  mwTokenValid,
  mwQuizValid,
  mwPlayerAddedToQuiz,
  mwCurrentDateValid,
  ctGetQuizQuestions,
);
// submit player answers
router.post(
  PATHS.QUIZ.SUBMITANSWERS,
  mwAuth,
  PlayerSubmitQuizAnswersSchema,
  validateSchema,
  mwTokenValid,
  mwPlayerAddedToQuiz,
  mwCurrentDateValid,
  ctSubmitQuizAnswers,
);

export default router;
