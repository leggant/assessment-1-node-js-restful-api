/**
 * User Related API Request Handler Methods
 * @module quizRequests
 */
import PRISMA from "./prisma.js";
import checkDataType from "./checkDataType.js";
import { dbDateStringFromDate } from "./dateTimeCheck.js";
import UnescapeString from "./unescapeString.js";

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
      const questionString = UnescapeString(q.question);
      const answerString = UnescapeString(q.correct_answer);
      const createquestions = PRISMA.question.create({
        data: {
          quizId: QUIZINFO.id,
          question: questionString,
          correctAnswer: answerString,
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

const getQuizDetails = async (quizId) => {
  const quizDetails = await PRISMA.quiz.findFirstOrThrow({
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
  const quizQuestions = await PRISMA.quiz.findFirstOrThrow({
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

const getAllIncompleteQuizzes = async (userId) => {
  // const quizzes =
  //   await PRISMA.$queryRaw`SELECT * FROM "Quiz" WHERE "endDate" > now() INNER JOIN `;
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
  // this needs to be removed - score to be added when player has answered all questions
  const score = await PRISMA.userScore.create({
    data: {
      userId,
      quizId,
      score: 0,
    },
  });
  return { participant, score };
};

const addQuizPlayerAnswer = async (quizId, playerId) => {
  console.log(quizId);
  console.log(playerId);
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
  getAllIncompleteQuizzes,
  updateQuizById,
  addPlayerAsQuizParticipant,
  addQuizPlayerAnswer,
  addPointToQuizPlayerScore,
};
