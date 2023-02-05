/**
 * @author @leggant
 * @fileoverview middleware to query the database, and confirm the player has been added to the quiz.
 * @exports mwPlayerAddedToQuiz
 */
import USERTYPE from "../constants/userType.js";
import PRISMA from "../../../utils/prisma.js";

/**
 * middleware confirming the player has been added to the quiz.
 * prevent admin users from playing quizzes
 * @function mwPlayerAddedToQuiz
 * @async
 * @param {Request} req HTTP request
 * @param {Request} req.params HTTP request param containing the quiz id value
 * @param {Request} req.user HTTP request user object containing the user Id
 * @param {Response} res HTTP response
 * @param {Response} next HTTP response
 * @returns {Request|Response}
 */
const mwPlayerAddedToQuiz = async (req, res, next) => {
  try {
    /**
     * block admins from playing quizzes with answers they have available to them
     * ahead to time
     * @constant {Boolean} isAdmin
     */
    const isAdmin = req.user.role === USERTYPE.ADMIN;
    if (isAdmin) {
      return res.status(403).json({ msg: "Basic Users Only." });
    }
    /**
     * @type {Number}
     */
    // eslint-disable-next-line prefer-destructuring
    const quizId = req.params.quizId;
    /**
     * @type {String}
     */
    const userId = req.user.id;
    /**
     * @type {String}
     */
    // eslint-disable-next-line prefer-destructuring
    const userName = req.user.userName;
    /**
     * verify the user in the request has been assigned to the quiz
     * query the userParticipate table for a row that include the quiz and user ids
     * and get quiz associated with this row
     * @constant {{UserParicipate: Object, Quiz: Object} | Null} validPlayer
     */
    const validPlayer = await PRISMA.userParticipate.findFirst({
      where: {
        userId,
        quizId,
      },
      include: {
        quiz: true,
      },
    });

    /**
     * check that the player is valid; if null return an error 422
     * otherwise continue
     */
    if (!validPlayer) {
      return res.status(422).json({
        msg: `${userName} has not been assigned to the request Quiz ID #${quizId}.`,
      });
    }
    /**
     * attach player and quiz information object to the request
     * continue in the request chain
     */
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
