import {
  addPlayerAsQuizParticipant,
  getQuizQuestions,
} from "../../../utils/quizRequests.js";

const ctAddQuizPlayer = async (req, res) => {
  // add player to quiz participant table
  // initialise player in score table
  const { quizId, userId, userName } = req.quizPlayer;
  const addPlayer = await addPlayerAsQuizParticipant(quizId, userId);
  if (!addPlayer.participant) {
    return res.status(400).json({
      msg: `${userName} was not successfully added as a participant.`,
    });
  }
  if (!addPlayer.score) {
    return res.status(400).json({
      msg: `${userName} was not successfully added to the quiz score board.`,
    });
  }
  const quizQs = await getQuizQuestions(quizId);
  return res.status(201).json({
    msg: `${userName} was successfully added to the quiz #${quizId}.`,
    quizQuestions: quizQs,
  });
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
