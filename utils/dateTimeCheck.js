/**
 * @author @leggant
 * @description date parsing, comparison and validation utilities which utilise moment.js
 */
import moment from "moment";

// * @typedef {import('./File1.js').MyObject1} MyObject1
/**
 * take a date from a user request, split it into day, month and year
 * @param {String} dateToSplit - date string set by the admin user quiz create request
 * @returns {{year: String, month: String, day: String}} - object contains each part of a date in seperate strings
 */
const splitDate = (dateToSplit) => {
  /**
   * @constant {Array.String} split
   */
  const split = dateToSplit.split("-");
  const year = split[0];
  let month = split[1];
  month = month.charAt(0) === "0" ? month.substring(1) : month;
  let day = split[2];
  day = day.charAt(0) === "0" ? day.substring(1) : day;
  return { year, month, day };
};
/**
 * create a database compatible date from a string
 * @param {String} date - input date string
 * @returns {Date} dateres - UTC Date
 */
const dbDateStringFromDate = (date) => {
  const data = splitDate(date);
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getUTCDate#try_it
  const dateres = new Date(`${data.month} ${data.day}, ${data.year} UTC`);
  return dateres;
};

/**
 * check the current date relative to the quiz date
 * @param {Date} quizDate
 * @returns {Boolean} isFuture - return true if the current date is before the quiz date
 */
const quizDateFuture = (quizDate) => {
  /**
   * @constant {moment.Moment} dateNow - current date
   */
  const dateNow = moment();
  const isFuture = dateNow.isBefore(quizDate);
  return isFuture;
};

/**
 * check if the user input quiz date is valid
 * @param {Date} qdate
 * @returns {Boolean} isAfter - return true if the quiz occurs after the current date
 */
const quizDateValid = (qdate) => {
  /**
   * @constant {moment.Moment} dateNow
   */
  const dateNow = moment();
  /**
   * @function moment(qDate)
   * @return {moment.Moment} quizDate
   */
  const quizDate = moment(qdate);
  const isAfter = quizDate.isAfter(dateNow);
  return isAfter;
};

/**
 * evaluate if the quiz end date is within 5 days of the start date
 * @param {Date} start - stored/input quiz start date
 * @param {Date} end - stored/input quiz end date
 * @see {@link https://momentjs.com/docs/#/displaying/difference|MomentJS}
 * @returns {Boolean} isValid
 */
const quizEnddateValid = (start, end) => {
  const quizDate = moment(start);
  const endDate = moment(end);
  // https://momentjs.com/docs/#/displaying/difference/
  /**
   * @constant {Number} difference - number of days between the start and end dates
   */
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
 * @see {@link https://stackoverflow.com/a/29495647} additional info
 */
const playerCanParticipate = (quizStart, quizEnd) => {
  const dateNow = moment();
  const start = moment(quizStart.toISOString());
  const end = moment(quizEnd.toISOString());
  // https://stackoverflow.com/a/29495647
  const canPartake = dateNow.isBetween(start, end, "days", "[)");
  return canPartake;
};

// eslint-disable-next-line import/prefer-default-export
export {
  quizDateFuture,
  splitDate,
  dbDateStringFromDate,
  quizDateValid,
  quizEnddateValid,
  playerCanParticipate,
};
