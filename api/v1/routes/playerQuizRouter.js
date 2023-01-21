import { Router } from "express";
import PATHS from "../constants/paths.js";
import validateSchema from "../middleware/mw_validateSchema.js";

import {
  ctAddQuizPlayer,
  ctGetQuizQuestions,
  ctSubmitQuizAnswers,
} from "../controllers/quizPlayerController.js";

import mwQuizValid from "../middleware/mw_quizValid.js";
import mwAuth from "../middleware/mw_authentication.js";
import mwTokenValid from "../middleware/mw_tokenValid.js";
import mwQuizPlayerValid from "../middleware/mw_quizPlayerValid.js";
import mwPlayerAddedToQuiz from "../middleware/mw_playerAddedToQuiz.js";
import mwCurrentDateValid from "../middleware/mw_currentDateValid.js";

import QuizParamSchema from "../schemas/param-quiz-schema.js";
import PlayerSubmitQuizAnswersSchema from "../schemas/player-submit-answers-schema.js";

const router = Router();

// add player to a quiz
router.post(
  PATHS.QUIZ.PLAYER,
  mwAuth,
  mwTokenValid,
  QuizParamSchema,
  validateSchema,
  mwQuizValid,
  mwQuizPlayerValid,
  ctAddQuizPlayer,
);
// get quiz questions
router.get(
  PATHS.QUIZ.QUESTIONS,
  mwAuth,
  mwTokenValid,
  QuizParamSchema,
  validateSchema,
  mwQuizValid,
  mwPlayerAddedToQuiz,
  mwCurrentDateValid,
  ctGetQuizQuestions,
);
// submit player answers
router.post(
  PATHS.QUIZ.SUBMITANSWERS,
  mwAuth,
  mwTokenValid,
  QuizParamSchema,
  validateSchema,
  mwPlayerAddedToQuiz,
  mwCurrentDateValid,
  PlayerSubmitQuizAnswersSchema,
  validateSchema,
  ctSubmitQuizAnswers,
);

export default router;
