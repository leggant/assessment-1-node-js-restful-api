import {
  getQuizDetails,
  getQuizQuestions,
  parsePlayerAnswers,
  getQuizAverageScore,
  getQuizCorrectAnswers,
  submitAllPlayerAnswers,
  getQuizMultiChoiceQuestions,
  addPlayerAsQuizParticipant,
} from "../../../utils/quizRequests.js";
import QUIZCONSTS from "../constants/quiz.js";

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
  const multichoice = quiz.quiz.answerType === QUIZCONSTS.ANSTYPE.MULTI;
  const quizQuestions = multichoice
    ? await getQuizMultiChoiceQuestions(quiz.quizId)
    : await getQuizQuestions(quiz.quizId);
  if (!quizQuestions) {
    return res.status(404).json({
      msg: `Quiz with ID# ${quiz.quizId} was not found.`,
    });
  }
  return res.status(200).json(quizQuestions.questions);
};

const ctSubmitQuizAnswers = async (req, res) => {
  const quizData = req.quizInfo.data;
  const { userName } = req.quizPlayer;
  const correctAnswers = await getQuizCorrectAnswers(quizData.quizId);
  if (!correctAnswers) {
    return res
      .status(404)
      .json({ msg: `No Answers Found For Quiz #${quizData.quizId}` });
  }
  // eslint-disable-next-line prefer-destructuring
  const submittedAnswers = req.body;
  const { parsedResults, finalScore } = await parsePlayerAnswers(
    quizData,
    submittedAnswers,
    correctAnswers,
  );
  if (!parsedResults.length || !finalScore.length) {
    return res.status(422).json({
      msg: `Error Parsing Players Answers For Quiz #${quizData.quizId}`,
    });
  }
  await submitAllPlayerAnswers(parsedResults, finalScore);
  const avg = await getQuizAverageScore(quizData.quizId);
  if (!avg.score) {
    return res.status(201).json({
      msg: `${userName} has successfully participated in ${quizData.quiz.name}.`,
      userScore: finalScore[0].score,
      quizAverageScore: "Error Occurred Calculating This Value.",
    });
  }
  return res.status(201).json({
    msg: `${userName} has successfully participated in ${quizData.quiz.name}.`,
    data: {
      userScore: finalScore[0].score,
      quizAverageScore: Number(avg.score.toFixed(3)),
    },
  });
};

export { ctAddQuizPlayer, ctGetQuizQuestions, ctSubmitQuizAnswers };
