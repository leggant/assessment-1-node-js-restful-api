import USERTYPE from "../constants/userType.js";
import PRISMA from "../../../utils/prisma.js";
import checkIfObjectIsEmpty from "../../../utils/checkEmptyObject.js";
import {
  playerCanParticipate,
  splitDate,
  dbDateStringFromDate,
} from "../../../utils/dateTimeCheck.js";

const mwQuizPlayerValid = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === USERTYPE.ADMIN;
    if (isAdmin) {
      throw new Error("Basic Users Only.");
    }
    const quizId = Number(req.params.quizId);
    const validQuiz = await PRISMA.quiz.findFirst({
      where: {
        id: quizId,
      },
      include: {
        userParticipateQuiz: true,
      },
    });
    if (validQuiz) {
      // if the quiz exists,
      // check the current user is not already included as a participant
      const participants = validQuiz.userParticipateQuiz;
      const userCanBeAdded = !participants.find(
        (el) => el.userId === req.user.id,
      );
      // if the user is ok to add to the quiz,
      // check the dates of the quiz to ensure the current date is with a valid range
      if (userCanBeAdded) {
        console.log(validQuiz.startDate);
        // const qStart = dbDateStringFromDate(validQuiz.startDate);
        // const qEnd = dbDateStringFromDate(validQuiz.endDate);
        // const quizDatesOk = await playerCanParticipate(qStart, qEnd);
        // req.player = {
        //   playerId: req.user.id,
        //   quizId,
        // };
        // console.log(quizDatesOk.valueOf());
        return next();
      }
      throw new Error("User Is Already A Participant In The Quiz.");
    }
    throw new Error(`Quiz With An ID of #${quizId} Was Not Found.`);
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
};

export default mwQuizPlayerValid;
