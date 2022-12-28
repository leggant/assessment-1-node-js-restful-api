import { Temporal } from "@js-temporal/polyfill";

const quizDateValid = (quizday, quizmonth, quizyear) => {
  const now = Temporal.Now.plainDateISO();
  const check = new Temporal.PlainDate(quizday, quizmonth, quizyear);
  const res = check.since(now).days;
  // eslint-disable-next-line no-unneeded-ternary
  const isValid = res <= 0 ? false : true;
  console.log("quiz date is valid", isValid.valueOf());
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
export { quizDateValid, quizEnddateValid };
