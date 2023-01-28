import { assert, expect } from "chai";
import { describe, it } from "mocha";
import moment from "moment";
import * as dateparser from "../../../utils/dateTimeCheck.js";

/**
 * @constant {{ split: String, quizStart: String, quizEnd: String }} testDates
 */
const testDates = { split: "2023-01-10", quizStart: "", quizEnd: "" };
const testNow = dateparser.createMomentDate();

describe("Test dateTimeCheck.js Utility Functions", () => {
  it("test split date string function", (done) => {
    const vals = dateparser.splitDate(testDates.split);
    assert.containsAllKeys(
      vals,
      ["year", "month", "day"],
      "An Error Occured, Split String Keys Not Returned",
    );
    done();
  });
  it("Validate Quiz Date/Current Date Are Within A Valid Range", (done) => {
    const qStart = testNow.add(2, "day").toDate();
    assert.isTrue(
      dateparser.quizDateValid(qStart),
      "Quiz Date Does Not Start After The Current Date",
    );
    done();
  });
  it("Gets UTC Date From A String", (done) => {
    const xday = testNow.add(2, "day").format("Y-M-D");
    const result = dateparser.dbDateStringFromDate(xday);
    assert.isTrue(moment.isDate(result), "Returned Value Is Not A Valid Date");
    assert.isOk(dateparser.dbDateStringFromDate(xday));
    done();
  });
});
