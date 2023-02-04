import { body, param } from "express-validator";
import PRISMA from "../../../utils/prisma.js";

const PlayerSubmitQuizAnswersSchema = [
  param("quizId")
    .escape()
    .trim()
    .isNumeric()
    .toInt()
    .withMessage("quizId param must have an integer value")
    .notEmpty()
    .withMessage("quizId is required"),
  body("quizAnswers").custom(async (quizAnswers, { req }) => {
    const len = quizAnswers.length;
    if (len !== 10) {
      throw new Error("There Must be 10 Answers Provided");
    }
    const user = req.quizPlayer;
    const checkPlayer = await PRISMA.userScore.findFirst({
      where: {
        AND: [{ userId: user.userId }, { quizId: user.quizId }],
      },
    });
    if (checkPlayer) {
      throw new Error("Player Has Already Participated In This Quiz.");
    }
    const entries = Object.entries(quizAnswers);
    entries.forEach((x) => {
      const keyval = Object.keys(x[1])[0];
      const ansval = Object.values(x[1])[0];
      const ansOk = typeof ansval === "string";
      const keyok = keyval === "answer";
      if (!keyok) {
        throw new Error(
          "Each answer object provided must have 'answer' as the key - i.e. { 'answer' : 'your answer' }",
        );
      }
      if (!ansOk) {
        throw new Error(
          "Each answer must contain a sting data type value - i.e. { 'answer' : 'true' }",
        );
      }
    });
    return true;
  }),
];

export default PlayerSubmitQuizAnswersSchema;
