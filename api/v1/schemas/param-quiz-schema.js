import { param } from "express-validator";

const QuizParamSchema = [
  param("quizId")
    .escape()
    .trim()
    .notEmpty()
    .withMessage("Quiz ID is a required param")
    .isNumeric()
    .withMessage("Quiz ID must be a integer")
    .toInt(),
];

export default QuizParamSchema;
