import moment from "moment";

/**
 * create a moment class object
 * @param {Date|undefined} dateToParse
 * @returns {moment.Moment} newDate - returns the date as a Moment class
 */
const createMomentDate = (dateToParse) => {
  let newDate;
  if (!dateToParse || dateToParse === undefined) {
    newDate = moment();
  }
  newDate = moment(dateToParse);
  return newDate;
};

const splitDate = (dateToSplit) => {
  const split = dateToSplit.split("-");
  const year = split[0];
  let month = split[1];
  month = month.charAt(0) === "0" ? month.substring(1) : month;
  let day = split[2];
  day = day.charAt(0) === "0" ? day.substring(1) : day;
  return { year, month, day };
};

const dbDateStringFromDate = (date) => {
  const data = splitDate(date);
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getUTCDate#try_it
  const dateres = new Date(`${data.month} ${data.day}, ${data.year} UTC`);
  return dateres;
};

const quizDateFuture = (quizDate) => {
  const dateNow = moment();
  const isFuture = moment(dateNow).isBefore(quizDate);
  return isFuture;
};
/**
 * check if the user input quiz date is valid
 * @param {Date} date
 * @returns {Boolean}
 */
const quizDateValid = (date) => {
  const dateNow = moment();
  const quizDate = moment(date);
  const isAfter = moment(quizDate).isAfter(dateNow);
  // console.info("quiz date is valid", isAfter.valueOf());
  return isAfter;
};

const quizEnddateValid = (start, end) => {
  const quizDate = moment(start);
  const endDate = moment(end);
  // https://momentjs.com/docs/#/displaying/difference/
  const difference = moment.duration(endDate.diff(quizDate)).days();
  // eslint-disable-next-line no-unneeded-ternary
  const isValid = difference > 0 && difference <= 5 ? true : false;
  return isValid;
};

/**
 * check the current date against the quiz start and end date; return boolean if the date is within range/player can take part in the quiz
 * @param {Date} quizStart quiz start date stored in the quiz table
 * @param {Date} quizEnd quiz end date stored in the quiz table
 * @returns {Boolean} canPartake - current date is permitted, player can answer quiz questions
 */
const playerCanParticipate = (quizStart, quizEnd) => {
  const dateNow = moment();
  const start = moment(quizStart.toISOString());
  const end = moment(quizEnd.toISOString());
  const canPartake = dateNow.isBetween(start, end);
  return canPartake;
};

// eslint-disable-next-line import/prefer-default-export
export {
  createMomentDate,
  quizDateFuture,
  splitDate,
  dbDateStringFromDate,
  quizDateValid,
  quizEnddateValid,
  playerCanParticipate,
};
