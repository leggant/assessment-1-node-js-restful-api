import { Temporal } from "@js-temporal/polyfill";

const splitDate = (dateToSplit) => {
  const split = dateToSplit.split("-");
  const year = split[0];
  let month = split[1];
  month = month.charAt(0) === "0" ? month.substring(1) : month;
  let day = split[2];
  day = day.charAt(0) === "0" ? day.substring(1) : day;
  return { year, month, day };
};

const quizDateValid = (quizday, quizmonth, quizyear) => {
  const now = Temporal.Now.plainDateISO();
  const check = new Temporal.PlainDate(quizyear, quizmonth, quizday);
  const res = check.since(now).days;
  // eslint-disable-next-line no-unneeded-ternary
  const isValid = res <= 0 ? false : true;
  console.info("quiz date is valid", isValid.valueOf());
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
  const quizDate = new Temporal.PlainDate(quizyear, quizmonth, quizday);
  const endDate = new Temporal.PlainDate(endyear, endmonth, endday);
  const difference = quizDate.until(endDate).days;
  // eslint-disable-next-line no-unneeded-ternary
  const isValid = difference > 0 && difference <= 5 ? true : false;
  console.log("end date is valid: ", isValid.valueOf());
  return isValid;
};

// eslint-disable-next-line import/prefer-default-export
export { splitDate, quizDateValid, quizEnddateValid };
