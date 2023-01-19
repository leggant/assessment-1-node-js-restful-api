import he from "he";

const unescapeString = (string) => {
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
  console.log(data);
  return data;
};
// eslint-disable-next-line import/prefer-default-export
export { unescapeString, unescapeArray };
