const pointIncrement = Number(process.env.POINT_INCREMENT) || 1;

function union(setA, setB) {
  const xunion = new Set(setA);
  setB.forEach((elem) => {
    xunion.add(elem);
  });
  return xunion;
}
/**
 * compare submitted answers, return score based on correct answers
 * @param {Array.<{id: Number, answer: Boolean|String}>} storedAnswers
 * @param {Array.<{id: Number, answer: Boolean|String}>} submittedAnswers
 * @returns {Number} score - total player to be added to the database
 */
const calculatePlayerScore = (storedAnswers, submittedAnswers) => {
  console.info(pointIncrement);
  const storedSet = new Set(storedAnswers);
  const submittedSet = new Set(submittedAnswers);
  /**
   * @constant {Number} score
   */
  const score = 0;
  return score;
};

export default calculatePlayerScore;
