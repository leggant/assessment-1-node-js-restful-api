import {
  addPlayerAsQuizParticipant,
  createNewQuiz,
  createNewQuizQuestions,
} from "../../../utils/quizRequests.js";
import PRISMA from "../../../utils/prisma.js";

const ctAddQuizPlayer = async (req, res) => {
  console.log(req);
  console.log(res);
};

const ctAddPlayerQuizAnswer = async (req, res) => {
  console.log(req);
  console.log(res);
};

const ctGetPlayerQuizResults = async (req, res) => {
  console.log(req);
  console.log(res);
};

const ctGetAllPlayerQuizResults = async (req, res) => {
  console.log(req);
  console.log(res);
};

export {
  ctAddQuizPlayer,
  ctAddPlayerQuizAnswer,
  ctGetPlayerQuizResults,
  ctGetAllPlayerQuizResults,
};
