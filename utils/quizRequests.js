/**
 * User Related API Request Handler Methods
 * @module quizRequests
 */
import PRISMA from "./prisma.js";
import checkDataType from "./checkDataType.js";
import checkIfObjectIsEmpty from "./checkEmptyObject.js";
import { dbDateStringFromDate } from "./dateTimeCheck.js";

const createNewQuiz = async (reqdata) => {
  const {
    categoryId,
    name,
    startDate,
    endDate,
    difficulty,
    answerType,
    numQuestions,
  } = reqdata;
  const dbStartDate = dbDateStringFromDate(startDate);
  const dbEndDate = dbDateStringFromDate(endDate);
  const newQuiz = await PRISMA.quiz.create({
    data: {
      categoryId,
      name,
      answerType,
      difficulty,
      numQuestions,
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
          difficulty: QUIZINFO.difficulty,
          answerType: QUIZINFO.answerType,
          questionCount: QUIZINFO.numQuestions,
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

const updateQuizById = async (quizId, data) => {
  const quiz = await PRISMA.quiz.findFirst({
    where: { id: Number(quizId) },
  });
  if (!quiz) {
    return false;
  }
  const updateRes = await PRISMA.quiz.update({
    where: { id: Number(quizId) },
    select: {
      categoryId: true,
      name: true,
      difficulty: true,
      answerType: true,
      numQuestions: true,
      startDate: true,
      endDate: true,
    },
    data: {
      ...data,
    },
  });
  const resTypeOfData = checkDataType(updateRes);
  const resOk = resTypeOfData === "object";
  if (resOk) {
    return updateRes;
  }
  return resOk;
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
  updateQuizById,
  createNewQuizQuestions,
  createNewQuizAnswers,
  addQuizPlayers,
};
