import he from "he";

const unescapeString = (string) => {
  let decoded = he.decode(string);
  decoded = decoded.replace(/[[\]"]/g, "'");
  return decoded;
};

export default unescapeString;
