/**
 * utility for verifying is an object is empty
 * @param {Object} obj - object to verify
 * @returns {Boolean} isEmpty
 * @exports checkIfObjectIsEmpty
 */
const checkIfObjectIsEmpty = (obj) => {
  const isEmpty = Object.keys(obj).length === 0;
  return isEmpty;
};

export default checkIfObjectIsEmpty;
