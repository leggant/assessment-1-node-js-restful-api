import checkDataType from "../../../utils/checkDataType.js";
import { createQuizOpenTDBRequest } from "../../../utils/axiosRequests.js";
import {
  createNewQuiz,
  createNewQuizQuestions,
  updateQuizById,
} from "../../../utils/quizRequests.js";
import PRISMA from "../../../utils/prisma.js";

const ctCreateQuiz = async (req, res) => {
  const { categoryId, difficulty, answerType, numQuestions } = req.body;
  // valid request - get quiz data from the 3rd party api
  const quizData = await createQuizOpenTDBRequest({
    category: categoryId,
    difficulty,
    answerType,
    amount: numQuestions,
  });
  const requestCode = quizData.response_code;
  if (requestCode === 1) {
    return res.status(404).json({ msg: "No Quiz Question Data Found." });
  }
  if (requestCode === 2) {
    return res.status(422).json({ msg: "Invalid Quiz Parameters." });
  }
  if (requestCode !== 0) {
    return res.status(400).json({ msg: "Quiz Data Request Error." });
  }
  // create a new quiz, get the quiz db id
  const newQuizItem = await createNewQuiz(req.body);
  return createNewQuizQuestions(quizData.results, newQuizItem, res);
};

const ctGetQuizById = async (req, res) => {
  const quizres = await PRISMA.quiz.findFirst({
    where: { id: req.params.quizId },
    select: {
      id: true,
      categoryId: true,
      name: true,
      answerType: true,
      difficulty: true,
      numQuestions: true,
      startDate: true,
      endDate: true,
      questions: {
        select: {
          id: true,
          quizId: true,
          question: true,
          possibleAnswers: true,
          correctAnswer: true,
        },
      },
      userParticipateQuiz: {
        select: {
          userId: true,
          quizId: true,
        },
      },
      userScores: {
        select: {
          id: true,
          userId: true,
          score: true,
        },
      },
    },
  });
  if (quizres) {
    res.status(200).json({ data: quizres });
  } else {
    res.status(404).json({ msg: "No Quiz Data Located." });
  }
};

const ctGetAllQuizzes = async (req, res) => {
  const allQuizzes = await PRISMA.quiz.findMany({
    include: {
      questions: true,
      userScores: true,
      userParticipateQuiz: true,
      userQuestionAnswers: true,
    },
    orderBy: {
      startDate: "desc",
    },
  });
  if (allQuizzes.length) {
    res.status(200).json({ data: allQuizzes });
  } else {
    res.status(404).json({ msg: "No Quiz Data Located." });
  }
};

const ctUpdateQuizById = async (req, res) => {
  try {
    const updateResult = await updateQuizById(req.params.quizId, req.body);
    const ok = checkDataType(updateResult);
    if (ok === "boolean") {
      return res.status(404).json({
        msg: `Quiz Update Error: Quiz #${req.params.quizId} Not Found + Update Not Completed.`,
      });
    }
    return res.status(200).json({
      msg: `${updateResult.name} Updated Successfully`,
      updateResult,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

const ctDeleteQuizById = async (req, res) => {
  const quizres = await PRISMA.quiz.findFirst({
    where: { id: req.params.quizId },
    include: {
      questions: true,
      userQuestionAnswers: true,
      userScores: true,
    },
  });
  if (!quizres) {
    return res
      .status(404)
      .json({ msg: `Quiz ID #${req.params.quizId} Was Not Found` });
  }
  if (quizres.userQuestionAnswers.length || quizres.userScores.length) {
    return res
      .status(422)
      .json({ msg: "Quiz has been played; Cannot be deleted." });
  }
  try {
    await PRISMA.quiz
      .delete({
        where: {
          id: req.params.quizId,
        },
        include: {
          questions: {
            where: {
              quizId: req.params.quizId,
            },
          },
        },
      })
      .catch((error) => {
        res.status(406).json({
          msg: `Error: Quiz ID #${req.params.quizId} Not Deleted.`,
          error,
        });
      });
    return res
      .status(200)
      .json({ msg: `Quiz ID #${req.params.quizId} Deleted.` });
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error });
  }
};

export {
  ctCreateQuiz,
  ctGetQuizById,
  ctGetAllQuizzes,
  ctUpdateQuizById,
  ctDeleteQuizById,
};
