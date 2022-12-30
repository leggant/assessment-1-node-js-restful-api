/**
 * User Related API Request Handler Methods
 * @module quizRequests
 */
import PRISMA from "./prisma.mjs";
import { dbDateStringFromDate } from "./dateTimeCheck.mjs";

const createNewQuiz = async (reqdata) => {
  const {
    categoryId,
    name,
    startDate,
    endDate,
    difficulty,
    answerType,
    questions,
  } = reqdata;
  const dbStartDate = dbDateStringFromDate(startDate);
  const dbEndDate = dbDateStringFromDate(endDate);
  const newQuiz = await PRISMA.quiz.create({
    data: {
      categoryId,
      name,
      answerType,
      difficulty,
      numQuestions: Number(questions),
      startDate: dbStartDate,
      endDate: dbEndDate,
    },
  });
  return newQuiz;
};

const createNewQuizQuestions = async (QUIZDATA, QUIZINFO, res) => {
  Promise.all(
    QUIZDATA.map((q) => {
      const createquestions = PRISMA.question.create({
        data: {
          quizId: QUIZINFO.id,
          question: q.question,
          correctAnswer: q.correct_answer,
          incorrectAnswers: q.incorrect_answers,
        },
      });
      return createquestions;
    }),
  )
    .then((data) => {
      const count = Object.keys(data).length;
      console.info(`${count} questions added to quiz ${QUIZINFO.name}`);
      res.status(201).json({
        msg: `${QUIZINFO.name} Successfully Created.`,
        data: {
          id: QUIZINFO.id,
          categoryId: QUIZDATA.categoryId,
          name: QUIZINFO.name,
          questionCount: count,
          difficulty: QUIZINFO.difficulty,
          answerType: QUIZINFO.answerType,
          quizStartDate: QUIZINFO.startDate,
          quizEndDate: QUIZINFO.endDate,
        },
      });
    })
    .catch((e) => {
      console.error(`Failed to create questions for quiz: ${QUIZINFO.name}`, e);
      res
        .status(401)
        .json({ msg: `Failed to create questions for quiz: ${QUIZINFO.name}` });
    });
};

const createNewQuizAnswers = async (reqdata) => {
  console.log(reqdata);
};

const addQuizPlayers = async (reqdata) => {
  console.log(reqdata);
};

// eslint-disable-next-line import/prefer-default-export
export {
  createNewQuiz,
  createNewQuizQuestions,
  createNewQuizAnswers,
  addQuizPlayers,
};
