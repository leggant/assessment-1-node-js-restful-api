import {
  addPlayerAsQuizParticipant,
  getQuizQuestions,
  getQuizDetails,
} from "../../../utils/quizRequests.js";

/**
 * controller method for basic users to add themselves to a current or future quiz
 * @param {Request} req - http request that contains user, quizPlayer object
 * @param {Response} res - http response return validation errors, request status
 * @returns {Response} return json object with validation errors, quiz information, quiz questions if the current date is within the range of the quiz start and end dates.
 */
const ctAddQuizPlayer = async (req, res) => {
  // add player to quiz participant table
  // initialise player in score table
  const { quizId, userId, userName, quizDatesOk } = req.quizPlayer;
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
  // check the result of the current date/quiz start and end date
  // validation performed by the middleware, passed to the controller
  // in the req.quizPlayer object
  let quizQs;
  if (quizDatesOk) {
    quizQs = await getQuizQuestions(quizId);
  } else {
    quizQs = await getQuizDetails(quizId);
  }
  return res.status(201).json({
    msg: `${userName} was successfully added to the quiz #${quizId}.`,
    data: quizQs,
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
