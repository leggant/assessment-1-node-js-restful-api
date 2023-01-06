import moment from "moment";
import USERTYPE from "../constants/userType.js";
import PRISMA from "../../../utils/prisma.js";
import { playerCanParticipate } from "../../../utils/dateTimeCheck.js";

const mwQuizPlayerValid = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === USERTYPE.ADMIN;
    if (isAdmin) {
      return res.status(403).json({ msg: "Basic Users Only." });
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
        const quizDatesOk = await playerCanParticipate(
          validQuiz.startDate,
          validQuiz.endDate,
        );
        if (quizDatesOk) {
          req.quizPlayer = {
            quizId,
            playerId: req.user.id,
          };
        } else if (!quizDatesOk) {
          return res.status(422).json({
            msg: `QuiZ Id #${quizId} Cannot Be Played. ${moment()} is not within the quiz date range: ${validQuiz.startDate.toDateString()}-${validQuiz.endDate.toDateString()}`,
          });
        }
      } else {
        return res.status(422).json({
          msg: `${req.user.userName} Is Already A Participant In The Quiz.`,
        });
      }
    } else {
      return res.status(404).json({
        msg: `Quiz With An ID of #${quizId} Was Not Found.`,
      });
    }
    return next();
  } catch (error) {
    return res.status(500).json({ msg: "Server Error Occured" });
  }
};

export default mwQuizPlayerValid;
