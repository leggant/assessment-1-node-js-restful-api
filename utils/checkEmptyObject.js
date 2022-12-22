const checkIfObjectIsEmpty = (obj) => {
  const isEmpty = Object.keys(obj).length === 0;
  return isEmpty;
};

export default checkIfObjectIsEmpty;
