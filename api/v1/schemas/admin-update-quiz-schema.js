import { body } from "express-validator";
import PRISMA from "../../../utils/prisma.mjs";
import QUIZCONSTS from "../constants/quiz.js";
import {
  quizDateValid,
  quizEnddateValid,
  splitDate,
} from "../../../utils/dateTimeCheck.mjs";

const UpdateQuizSchema = [
  body("categoryId")
    .escape()
    .trim()
    .optional({ nullable: true })
    .isNumeric()
    .toInt()
    .withMessage("ID must be an integer value")
    .custom(async (categoryId, { req }) => {
      if (req.body.categoryId) {
        const categories = await PRISMA.category.findUniqueOrThrow({
          where: {
            id: Number(req.body.categoryId),
          },
          select: {
            id: true,
          },
        });
        if (categories.id !== Number(req.body.categoryId)) {
          throw new Error("Invalid Category ID");
        }
      }
      return true;
    }),
  body("name")
    .escape()
    .trim()
    .optional({ nullable: true })
    .matches(/[a-zA-Z\s]/gi)
    .withMessage(
      "Quiz name must contain letters only. No numbers or special characters",
    )
    .isLength({ min: 5, max: 30 })
    .withMessage("Quiz Name Must Be Between 5 and 30 characters"),
  body("difficulty")
    .escape()
    .trim()
    .optional({ nullable: true })
    .isIn([QUIZCONSTS.LEVEL.EASY, QUIZCONSTS.LEVEL.MED, QUIZCONSTS.LEVEL.HARD])
    .withMessage("Quiz Level Must Be Valid"),
  body("answerType")
    .escape()
    .trim()
    .optional({ nullable: true })
    .isIn([QUIZCONSTS.ANSTYPE.MULTI, QUIZCONSTS.ANSTYPE.TRUEFALSE])
    .withMessage("Quiz Answer Type Must Be Valid"),
  body("numQuestions")
    .escape()
    .trim()
    .optional({ nullable: true })
    .isNumeric()
    .withMessage("Number of questions, must have a numeric value")
    .isInt({ min: 10, max: 10 })
    .toInt()
    .withMessage("Number of questions must equal 10."),
  body("startDate")
    .escape()
    .trim()
    .optional({ nullable: true })
    .isDate()
    .withMessage("Correctly formated date required")
    .custom((start, { req }) => {
      if (req.body.startDate) {
        const dateSplit = splitDate(req.body.startDate);
        const isValid = quizDateValid(
          dateSplit.day,
          dateSplit.month,
          dateSplit.year,
        );
        if (!isValid) {
          throw new Error(
            "Quiz Start Date is Invalid. This must be a date in the future.",
          );
        }
      }
      return true;
    }),
  body("endDate")
    .escape()
    .trim()
    .optional({ nullable: true })
    .isDate()
    .withMessage("Correctly Formated Date Required")
    .custom((end, { req }) => {
      if (req.body.startDate && req.body.endDate) {
        const startSplit = splitDate(req.body.startDate);
        const endSplit = splitDate(req.body.endDate);
        const isValid = quizEnddateValid(
          startSplit.day,
          startSplit.month,
          startSplit.year,
          endSplit.day,
          endSplit.month,
          endSplit.year,
        );
        if (!isValid) {
          throw new Error(
            "Quiz Start/End Dates are Invalid. The start date must be in the future, and the end date must come after within 5 days.",
          );
        }
      }
      return true;
    }),
];

export default UpdateQuizSchema;
