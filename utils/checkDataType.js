const checkDataType = (data) => {
  let type;
  if (data === null) {
    type = null;
  } else {
    type = typeof data;
  }
  return type;
};

export default checkDataType;
