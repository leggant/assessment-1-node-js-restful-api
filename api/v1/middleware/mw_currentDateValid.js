import moment from "moment";
import { playerCanParticipate } from "../../../utils/dateTimeCheck.js";

const mwCurrentDateValid = async (req, res, next) => {
  try {
    const quizStartDate = req.quizInfo.data.quiz.startDate;
    const quizEndDate = req.quizInfo.data.quiz.endDate;
    const quizDatesOk = await playerCanParticipate(quizStartDate, quizEndDate);
    if (!quizDatesOk) {
      return res.status(422).json({
        msg: `Quiz Id #${
          req.quizInfo.data.quizId
        } Cannot Be Played. ${moment()} is not within the quiz date range: ${quizStartDate.toDateString()}-${quizEndDate.toDateString()}`,
      });
    }
    return next();
  } catch (error) {
    return res.status(500).json({ msg: "Server Error Occured" });
  }
};

export default mwCurrentDateValid;
