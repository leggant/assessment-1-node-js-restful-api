/**
 * User Related API Request Handler Methods
 * @module quizRequests
 */
import PRISMA from "./prisma.js";
import checkDataType from "./checkDataType.js";
import { dbDateStringFromDate } from "./dateTimeCheck.js";
import { unescapeString, unescapeArray } from "./unescapeData.js";

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
    question: dataGenerator.eString(questions.question),
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

const getQuizDetails = async (quizId) => {
  const quizDetails = await PRISMA.quiz.findFirst({
    where: {
      id: quizId,
    },
    select: {
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
      name: true,
      categoryId: true,
      answerType: true,
      difficulty: true,
      numQuestions: true,
      startDate: true,
      endDate: true,
      questions: {
        select: {
          id: true,
          question: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
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
      categoryId: true,
      answerType: true,
      difficulty: true,
      numQuestions: true,
      startDate: true,
      endDate: true,
      questions: {
        select: {
          id: true,
          question: true,
          possibleAnswers: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  return quizQuestions;
};

const getAllIncompleteQuizzes = async (userId) => {
  const quizzes = await PRISMA.userParticipate.findMany({
    where: {
      userId,
      quiz: {
        userScores: {
          every: {
            userId: {
              equals: userId,
            },
            score: {
              equals: 0,
            },
          },
        },
      },
    },
    select: {
      userId: true,
      quizId: true,
      quiz: {
        select: {
          name: true,
          startDate: true,
          endDate: true,
          difficulty: true,
          answerType: true,
          userScores: {
            select: {
              score: true,
            },
          },
        },
      },
    },
  });
  return quizzes;
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

const submitAllPlayerAnswers = async (quiz, answers) => {
  console.info(quiz);
  console.info(answers);
};

const addPointToQuizPlayerScore = async (quizId, userId) => {
  console.log(quizId);
  console.log(userId);
  const score = await PRISMA.userScore.create({
    data: {
      userId,
      quizId,
      score: 0,
    },
  });
};

// eslint-disable-next-line import/prefer-default-export
export {
  createNewQuiz,
  createNewQuizQuestions,
  getQuizDetails,
  getQuizQuestions,
  getQuizMultiChoiceQuestions,
  getAllIncompleteQuizzes,
  updateQuizById,
  addPlayerAsQuizParticipant,
  submitAllPlayerAnswers,
  addPointToQuizPlayerScore,
};
