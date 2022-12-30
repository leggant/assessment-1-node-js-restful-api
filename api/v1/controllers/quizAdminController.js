import checkDataType from "../../../utils/checkDataType.js";
import { createQuizOpenTDBRequest } from "../../../utils/axiosRequests.mjs";
import {
  createNewQuiz,
  createNewQuizQuestions,
  updateQuizById,
} from "../../../utils/quizRequests.mjs";
import PRISMA from "../../../utils/prisma.mjs";

const ctCreateQuiz = async (req, res) => {
  const { categoryId, difficulty, answerType, numQuestions } = req.body;
  // create a new quiz, get the quiz db id
  const newQuizItem = await createNewQuiz(req.body);
  // valid request - get quiz data from the 3rd party api
  const quizData = await createQuizOpenTDBRequest({
    category: categoryId,
    difficulty,
    answerType,
    amount: numQuestions,
  });
  // create questions from the quizData object, newQuizItem.id quiz id
  await createNewQuizQuestions(quizData, newQuizItem, res);
};

const ctGetQuizById = async (req, res) => {
  const quizres = await PRISMA.quiz.findFirst({
    where: { id: Number(req.params.quizId) },
    include: {
      questions: true,
      userScores: true,
      userParticipateQuiz: true,
      userQuestionAnswers: true,
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
  });
  if (allQuizzes.length) {
    res.status(200).json({ data: allQuizzes });
  } else {
    res.status(404).json({ msg: "No Quiz Data Located." });
  }
};

const ctUpdateQuizById = async (req, res) => {
  try {
    const quizId = Number(req.params.quizId);
    const updateResult = await updateQuizById(quizId, req.body);
    const ok = checkDataType(updateResult);
    if (ok === "boolean") {
      return res
        .status(400)
        .json({ msg: `Quiz Update Error: Update Not Completed.` });
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
    where: { id: Number(req.params.quizId) },
    include: {
      questions: true,
    },
  });
  if (quizres) {
    await PRISMA.quiz
      .delete({
        where: { id: quizres.id },
        include: {
          questions: true,
        },
      })
      .then((result) => {
        res
          .status(202)
          .json({ msg: `Quiz ${result.name} Deleted Successfully.` });
      });
  } else {
    res.status(404).json({ msg: "Quiz Not Found." });
  }
};

export {
  ctCreateQuiz,
  ctGetQuizById,
  ctGetAllQuizzes,
  ctUpdateQuizById,
  ctDeleteQuizById,
};
