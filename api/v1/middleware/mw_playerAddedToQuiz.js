import USERTYPE from "../constants/userType.js";
import PRISMA from "../../../utils/prisma.js";

/**
 * middleware confirming the player has been added to the quiz
 * @param {Request} req HTTP request
 * @param {Response} res HTTP response
 * @param {Response} next HTTP response
 * @returns {Response}
 */
const mwPlayerAddedToQuiz = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === USERTYPE.ADMIN;
    if (isAdmin) {
      return res.status(403).json({ msg: "Basic Users Only." });
    }
    const quizId = Number(req.params.quizId);
    const userId = req.user.id;
    // eslint-disable-next-line prefer-destructuring
    const userName = req.user.userName;
    const validPlayer = await PRISMA.userParticipate.findFirst({
      where: {
        userId,
        quizId,
      },
      include: {
        quiz: true,
      },
    });
    // if the player is signed to the quiz
    // continue with the request; otherwise reject with error message
    if (!validPlayer) {
      return res.status(422).json({
        msg: `${userName} has not been assigned to the request Quiz ID #${quizId}.`,
      });
    }
    req.quizPlayer = {
      quizId,
      userId,
      userName,
    };
    req.quizInfo = {
      data: validPlayer,
    };
    return next();
  } catch (error) {
    return res.status(500).json({ msg: "Server Error Occured" });
  }
};

export default mwPlayerAddedToQuiz;
