import { body } from "express-validator";

import PRISMA from "../../../utils/prisma.mjs";
import QUIZCONSTS from "../constants/quiz.js";
import {
  quizDateValid,
  quizEnddateValid,
  splitDate,
} from "../../../utils/dateTimeCheck.mjs";

const NewQuizSchema = [
  body("categoryId")
    .escape()
    .trim()
    .isNumeric()
    .toInt()
    .withMessage("ID must be an integer value")
    .notEmpty()
    .withMessage("Category ID Is Required")
    .custom(async (categoryId, { req }) => {
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
      return true;
    }),
  body("name")
    .escape()
    .trim()
    .matches(/[a-zA-Z\s]/gi)
    .withMessage(
      "Quiz name must contain letters only. No numbers or special characters",
    )
    .isLength({ min: 5, max: 30 })
    .withMessage("Quiz Name Must Be Between 5 and 30 characters")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Quiz Name Is Required"),
  body("difficulty")
    .escape()
    .trim()
    .isIn([QUIZCONSTS.LEVEL.EASY, QUIZCONSTS.LEVEL.MED, QUIZCONSTS.LEVEL.HARD])
    .withMessage("Quiz Level Must Be Valid")
    .notEmpty()
    .withMessage("Quiz Level is Required"),
  body("answerType")
    .escape()
    .trim()
    .isIn([QUIZCONSTS.ANSTYPE.MULTI, QUIZCONSTS.ANSTYPE.TRUEFALSE])
    .withMessage("Quiz Answer Type Must Be Valid")
    .notEmpty()
    .withMessage("Quiz Answer Type is Required"),
  body("questions")
    .escape()
    .trim()
    .isNumeric()
    .withMessage("Number of questions, must have a numeric value")
    .isInt({ min: 10, max: 10 })
    .withMessage("Number of questions must equal 10.")
    .notEmpty()
    .withMessage("Number of questions is Required"),
  body("startDate")
    .escape()
    .trim()
    .isDate()
    .withMessage("Correctly formated date required")
    .custom((start, { req }) => {
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
      return true;
    })
    .notEmpty()
    .withMessage("Quiz Start Date is Required."),
  body("endDate")
    .escape()
    .trim()
    .isDate()
    .withMessage("Correctly Formated Date Required")
    .custom((end, { req }) => {
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
      return true;
    })
    .notEmpty()
    .withMessage("Quiz End Date is Required"),
];

export default NewQuizSchema;
