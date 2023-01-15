import {
  addPlayerAsQuizParticipant,
  getQuizQuestions,
  getQuizDetails,
  getAllIncompleteQuizzes,
  submitAllPlayerAnswers,
} from "../../../utils/quizRequests.js";

/**
 * controller method for basic users to add themselves to a current or future quiz
 * @param {Request} req - http request that contains user, quizPlayer object
 * @param {Response} res - http response return validation errors, request status
 * @returns {Response} res - return json object with validation errors, quiz information, quiz questions if the current date is within the range of the quiz start and end dates.
 */
const ctAddQuizPlayer = async (req, res) => {
  // add player to quiz participant table
  const { quizId, userId, userName, quizDatesOk } = req.quizPlayer;
  const addPlayer = await addPlayerAsQuizParticipant(quizId, userId);
  if (!addPlayer) {
    return res.status(400).json({
      msg: `${userName} was not successfully added as a participant.`,
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

const ctGetQuizQuestions = async (req, res) => {
  const quiz = req.quizInfo.data;
  const quizQuestions = await getQuizQuestions(quiz.quizId);
  if (!quizQuestions) {
    return res.status(404).json({
      msg: `Quiz with ID# ${quiz.quizId} was not found.`,
    });
  }
  return res.status(200).json(quizQuestions.questions);
};

const ctSubmitQuizAnswers = async (req, res) => {
  // console.log(req.quizPlayer);
  // console.log(req.quizInfo);
  const submitAnswers = await submitAllPlayerAnswers(
    req.quizPlayer,
    req.quizInfo,
    req.body,
  );
};

const ctGetPlayersIncompleteQuizzes = async (req, res) => {
  const quizzes = await getAllIncompleteQuizzes(req.user.id);
  console.info(quizzes);
  // if (!addPlayer.participant) {
  //   return res.status(400).json({
  //     msg: `${userName} was not successfully added as a participant.`,
  //   });
  // }
  // if (!addPlayer.score) {
  //   return res.status(400).json({
  //     msg: `${userName} was not successfully added to the quiz score board.`,
  //   });
  // }
  // // check the result of the current date/quiz start and end date
  // // validation performed by the middleware, passed to the controller
  // // in the req.quizPlayer object
  // let quizQs;
  // if (quizDatesOk) {
  //   quizQs = await getQuizQuestions(quizId);
  // } else {
  //   quizQs = await getQuizDetails(quizId);
  // }
  // return res.status(201).json({
  //   msg: `${userName} was successfully added to the quiz #${quizId}.`,
  //   data: quizQs,
  // });
};

const ctGetPlayerQuizResults = async (req, res) => {
  console.log(req);
  console.log(res);
};

export {
  ctAddQuizPlayer,
  ctGetQuizQuestions,
  ctSubmitQuizAnswers,
  ctGetPlayerQuizResults,
  ctGetPlayersIncompleteQuizzes,
};
