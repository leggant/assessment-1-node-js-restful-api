import { Temporal } from "@js-temporal/polyfill";
import moment from "moment";

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

const quizDateValid = (quizday, quizmonth, quizyear) => {
  const now = Temporal.Now.plainDateISO();
  const check = new Temporal.PlainDate(quizyear, quizmonth, quizday);
  const res = check.since(now).days;
  // eslint-disable-next-line no-unneeded-ternary
  const isValid = res <= 0 ? false : true;
  // console.info("quiz date is valid", isValid.valueOf());
  return isValid;
};

const quizEnddateValid = (
  quizday,
  quizmonth,
  quizyear,
  endday,
  endmonth,
  endyear,
) => {
  const quizDate = moment(`${quizyear}-${quizmonth}-${quizday}`);
  const endDate = moment(`${endyear}-${endmonth}-${endday}`);
  // https://momentjs.com/docs/#/displaying/difference/
  const difference = moment.duration(endDate.diff(quizDate)).asDays();
  // eslint-disable-next-line no-unneeded-ternary
  const isValid = difference > 0 && difference <= 5 ? true : false;
  return isValid;
};

const playerCanParticipate = (quizStart, quizEnd) => {
  const dateNow = moment().format("YYYY-M-D");
  const start = moment(quizStart, "YYYY-M-D").format("YYYY-M-D");
  const end = moment(quizEnd, "YYYY-M-D").format("YYYY-M-D");
  const sameOrAfter = moment(dateNow).isSameOrAfter(start);
  const sameOrBefore = moment(dateNow).isSameOrBefore(end);
  const canPartake = sameOrAfter && sameOrBefore;
  return canPartake;
};

// eslint-disable-next-line import/prefer-default-export
export {
  splitDate,
  dbDateStringFromDate,
  quizDateValid,
  quizEnddateValid,
  playerCanParticipate,
};
