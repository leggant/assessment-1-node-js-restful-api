/**
 * User Related API Request Handler Methods
 * @module quizRequests
 */
import PRISMA from "./prisma.mjs";
import USERTYPE from "../api/v1/constants/userType.js";
import checkDataType from "./checkDataType.js";
import checkIfObjectIsEmpty from "./checkEmptyObject.js";
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
  console.log(
    startDate,
    endDate,
    categoryId,
    difficulty,
    answerType,
    questions,
  );
  const dbStartDate = dbDateStringFromDate(startDate);
  const dbEndDate = dbDateStringFromDate(endDate);
  const newQuiz = await PRISMA.quiz.create({
    data: {
      categoryId,
      name,
      answerType,
      difficulty,
      startDate: dbStartDate,
      endDate: dbEndDate,
    },
  });
  return newQuiz;
};

const createNewQuizQuestions = async (reqdata) => {
  console.log(reqdata);
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
