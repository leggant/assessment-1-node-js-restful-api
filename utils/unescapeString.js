import he from "he";

const unescapeString = (string) => {
  const decoded = he.decode(string);
  return decoded;
};

export default unescapeString;
