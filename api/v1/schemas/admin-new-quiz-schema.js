import { body } from "express-validator";
import PRISMA from "../../../utils/prisma.mjs";
import QUIZCONSTS from "../constants/quiz.js";

const NewQuizSchema = [
  body("categoryId")
    .escape()
    .trim()
    .isNumeric()
    .withMessage("ID must be an integer value")
    .notEmpty()
    .withMessage("Category ID Is Required")
    .custom(async (id, { req }) => {
      const categories = await PRISMA.category.findMany({
        select: {
          id: true,
        },
      });
      if (!categories.includes(Number(req.body.id))) {
        throw new Error("Invalid Category ID");
      }
      return true;
    }),
  body("name")
    .escape()
    .trim()
    .isAlpha()
    .withMessage(
      "Quiz name must contain letters only. No numbers or special characters",
    )
    .isLength({ min: 5, max: 30 })
    .withMessage("Quiz Name Must Be Between 5 and 30 characters")
    .notEmpty()
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
    .custom((pass, { req }) => {
      if (pass !== req.body.password) {
        throw new Error("Password and Confirmation Password Mismatch");
      }
      return true;
    })
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Confirmation Password is Required."),
  body("endDate")
    .escape()
    .trim()
    .isStrongPassword({ minLength: 8, minNumbers: 1, minSymbols: 1 })
    .withMessage(
      "Confirmation Password must have at least 8 characters, one number and one special character",
    )
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be 8 char min and 16 char max lengths")
    .custom((pass, { req }) => {
      if (pass !== req.body.password) {
        throw new Error("Password and Confirmation Password Mismatch");
      }
      return true;
    })
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Confirmation Password is Required."),
];

export default NewQuizSchema;
