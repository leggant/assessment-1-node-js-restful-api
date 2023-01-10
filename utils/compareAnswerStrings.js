/**
 * compare two string values, check for a match
 * @param {String} userAnswer the answer submitted by the user
 * @param {String} storedAnswer the answer stored in the database
 * @returns {Boolean} result - return true/false the answers match
 */
const compareAnswerStrings = (userAnswer, storedAnswer) => {
  // https://stackoverflow.com/a/16913929
  const uAnswer = userAnswer.toLowerCase().replace(/[^a-z0-9 ]/g, "");
  const sAnswer = storedAnswer.toLowerCase().replace(/[^a-z0-9 ]/g, "");
  const result = uAnswer === sAnswer;
  return result;
};

export default compareAnswerStrings;
