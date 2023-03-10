/**
 * User Related API Request Handler Methods
 */
import PRISMA from "./prisma.js";
import QUIZCONSTS from "../api/v1/constants/quiz.js";
import { dbDateStringFromDate } from "./dateTimeCheck.js";
import { unescapeString, unescapeArray } from "./unescapeData.js";
import checkDataType from "./checkDataType.js";
import compareAnswerStrings from "./compareAnswerStrings.js";

const dataGenerator = {
  eString: (stringVal) => {
    const escaped = unescapeString(stringVal);
    return escaped;
  },
  pStringArray: (incorrectAnswers, answer) => {
    const incorrect = unescapeArray(incorrectAnswers);
    const possibleAnswerArray = [...incorrect, answer];
    return possibleAnswerArray.sort();
  },
};

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
  const qData = Array.from(QUIZDATA).map((questions) => ({
    quizId: QUIZINFO.id,
    question:
      QUIZINFO.answerType === QUIZCONSTS.ANSTYPE.TRUEFALSE
        ? dataGenerator.eString(`${questions.question} True or False?`)
        : dataGenerator.eString(questions.question),
    correctAnswer: dataGenerator.eString(questions.correct_answer),
    incorrectAnswers: questions.incorrect_answers,
    possibleAnswers: dataGenerator.pStringArray(
      questions.incorrect_answers,
      dataGenerator.eString(questions.correct_answer),
    ),
  }));
  await PRISMA.question
    .createMany({
      data: qData,
    })
    .then((qResult) => {
      console.info(`${qResult.count} questions added to quiz ${QUIZINFO.name}`);
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
      res.status(401).json({
        msg: `Failed to create questions for quiz: ${QUIZINFO.name}`,
      });
    });
};

const updateQuizById = async (quizId, data) => {
  const quiz = await PRISMA.quiz.findFirst({
    where: { id: quizId },
  });
  if (!quiz) {
    return false;
  }
  const updateRes = await PRISMA.quiz.update({
    where: { id: quizId },
    select: {
      categoryId: true,
      name: true,
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

const getQuizDetails = async (quizId) => {
  const quizDetails = await PRISMA.quiz.findFirst({
    where: {
      id: quizId,
    },
    select: {
      id: true,
      name: true,
      categoryId: true,
      answerType: true,
      difficulty: true,
      numQuestions: true,
      startDate: true,
      endDate: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  return quizDetails;
};

const getQuizQuestions = async (quizId) => {
  const quizQuestions = await PRISMA.quiz.findFirst({
    where: {
      id: quizId,
    },
    select: {
      id: true,
      name: true,
      answerType: true,
      difficulty: true,
      numQuestions: true,
      startDate: true,
      endDate: true,
      categoryId: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      questions: {
        select: {
          id: true,
          question: true,
        },
      },
    },
  });
  return quizQuestions;
};

const getQuizMultiChoiceQuestions = async (quizId) => {
  const quizQuestions = await PRISMA.quiz.findFirst({
    where: {
      id: quizId,
    },
    select: {
      name: true,
      answerType: true,
      difficulty: true,
      numQuestions: true,
      startDate: true,
      endDate: true,
      categoryId: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      questions: {
        select: {
          id: true,
          question: true,
          possibleAnswers: true,
        },
      },
    },
  });
  return quizQuestions;
};

const addPlayerAsQuizParticipant = async (quizId, userId) => {
  const participant = await PRISMA.userParticipate.create({
    data: {
      userId,
      quizId,
    },
  });
  return participant;
};

const parsePlayerAnswers = async (quiz, userAnswers, answers) => {
  const { quizId, userId } = quiz;
  const answer = userAnswers.quizAnswers;
  const storedAnswers = await answers.questions;
  const parsedResults = [];
  let score = 0;
  storedAnswers.forEach((xAnswer, i) => {
    const qID = xAnswer.id;
    const uAnswer = answer[i].answer;
    const sAnswer = xAnswer.correctAnswer;
    const match = compareAnswerStrings(uAnswer, sAnswer);
    score = match ? score + 1 : score;
    parsedResults.push({
      userId,
      quizId,
      questionId: qID,
      answer: uAnswer,
      correctAnswer: match.valueOf(),
    });
  });
  const finalScore = [
    {
      userId,
      quizId,
      score,
    },
  ];
  return { parsedResults, finalScore };
};

const submitAllPlayerAnswers = async (answers, result) => {
  const submitAnswers = await PRISMA.userQuestionAnswer.createMany({
    data: answers,
  });
  const { userId, quizId, score } = result[0];
  const submitScore = await PRISMA.userScore.create({
    data: {
      userId,
      quizId,
      score,
    },
  });
  return { submitAnswers, submitScore };
};

const getQuizCorrectAnswers = async (quizId) => {
  const quizAnswerList = await PRISMA.quiz.findFirst({
    where: {
      id: quizId,
    },
    select: {
      questions: {
        select: {
          id: true,
          correctAnswer: true,
        },
      },
    },
  });
  return quizAnswerList;
};

const getQuizAverageScore = async (quizId) => {
  const quizAvg = await PRISMA.userScore.aggregate({
    where: {
      quizId,
    },
    _avg: {
      score: true,
    },
  });
  const obj = Object.entries(quizAvg);
  return obj[0][1];
};

// eslint-disable-next-line import/prefer-default-export
export {
  createNewQuiz,
  parsePlayerAnswers,
  submitAllPlayerAnswers,
  createNewQuizQuestions,
  addPlayerAsQuizParticipant,
  getQuizDetails,
  getQuizQuestions,
  getQuizAverageScore,
  getQuizCorrectAnswers,
  getQuizMultiChoiceQuestions,
  updateQuizById,
};
