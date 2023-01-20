import moment from "moment";
import PRISMA from "../../../utils/prisma.js";
import {
  playerCanParticipate,
  quizDateFuture,
} from "../../../utils/dateTimeCheck.js";

const mwQuizValid = async (req, res, next) => {
  try {
    // eslint-disable-next-line prefer-destructuring
    const quizId = req.params.quizId;
    // eslint-disable-next-line prefer-destructuring
    const validQuiz = await PRISMA.quiz.findFirst({
      where: {
        id: quizId,
      },
    });
    if (!validQuiz) {
      // if the quiz does not exist,
      return res.status(404).json({
        msg: `Quiz Id #${quizId} Was Not Found.`,
      });
    }
    const quizDatesOk = await playerCanParticipate(
      validQuiz.startDate,
      validQuiz.endDate,
    );
    const quizDateIsInFuture = quizDateFuture(validQuiz.startDate);
    // check the current user is not already included as a participant
    if (quizDatesOk || quizDateIsInFuture) {
      req.quizPlayer = {
        quizId,
        quizDatesOk,
      };
    } else if (!quizDatesOk) {
      return res.status(422).json({
        msg: `Quiz Id #${quizId} Cannot Be Played. ${moment()} is not within the quiz date range: ${validQuiz.startDate.toDateString()}-${validQuiz.endDate.toDateString()}`,
      });
    }
    return next();
  } catch (error) {
    return res.status(500).json({ msg: "Server Error Occured" });
  }
};

export default mwQuizValid;
