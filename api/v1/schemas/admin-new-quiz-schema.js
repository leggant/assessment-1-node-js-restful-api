import { body } from "express-validator";

import PRISMA from "../../../utils/prisma.mjs";
import QUIZCONSTS from "../constants/quiz.js";

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
  body("startDate")
    .escape()
    .trim()
    .isDate()
    .withMessage("Correctly formated date required")
    .notEmpty()
    .withMessage("Quiz Start Date is Required."),
  body("endDate")
    .escape()
    .trim()
    .isDate()
    .withMessage("Correctly Formated Date Required")
    .notEmpty()
    .withMessage("Quiz End Date is Required"),
];

export default NewQuizSchema;
