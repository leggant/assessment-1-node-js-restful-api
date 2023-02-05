import he from "he";

/**
 * return a string decoded using the "he" node js package
 * @function unescapeString
 * @param {String} string
 * @returns {String} decoded
 */
const unescapeString = (string) => {
  /**
   * @constant {String} decoded
   */
  let decoded = he.decode(string);
  decoded = decoded.replace(/[[\]"]/g, "'");
  return decoded;
};
/**
 * map through an array of strings, return strings un-escaped/plain text
 * @param {Array.<string>} stringDataArray
 * @returns {Array.<string>} data
 */
const unescapeArray = (stringDataArray) => {
  const data = [];
  stringDataArray.forEach((item) => {
    const x = unescapeString(item);
    data.push(x);
  });
  return data;
};
// eslint-disable-next-line import/prefer-default-export
export { unescapeString, unescapeArray };
