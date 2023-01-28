import { assert, expect } from "chai";
import { describe, it } from "mocha";
import * as axios from "../../../utils/axiosRequests.js";

describe("Test Gist Seeder endpoints with axioRequests.js Util Functions", () => {
  it("test gist endpoint to get user data", (done) => {
    const userReq = new Promise((resolve) => {
      resolve(axios.getUsers());
    });
    userReq.then((res) => {
      assert.isArray(res.users);
    });
    done();
  });
  // it("test split date string function", (done) => {
  //   const vals = dateparser.splitDate("2023-01-10");
  //   assert.containsAllKeys(
  //     vals,
  //     ["year", "month", "day"],
  //     "An Error Occured, Split String Keys Not Returned",
  //   );
  //   done();
  // });
  // it("Validate Quiz Date/Current Date Are Within A Valid Range", (done) => {
  //   const qStart = moment().add(2, "day").toDate();
  //   assert.isTrue(
  //     dateparser.quizDateValid(qStart),
  //     "Quiz Date Does Not Start After The Current Date",
  //   );
  //   done();
  // });
  // it("Creates a UTC Date From A String", (done) => {
  //   const xday = moment().add(2, "day").format("Y-M-D");
  //   const result = dateparser.dbDateStringFromDate(xday);
  //   assert.isTrue(moment.isDate(result), "Returned Value Is Not A Valid Date");
  //   assert.isOk(dateparser.dbDateStringFromDate(xday));
  //   done();
  // });
  // it("Check That The Current Date Falls Between the Quiz Start/End Dates", (done) => {
  //   const startOk = moment().subtract(1, "day").toDate();
  //   const endOk = moment().add(2, "days").toDate();
  //   assert.isTrue(
  //     dateparser.playerCanParticipate(startOk, endOk),
  //     "Current Date Is Not Within A Valid Range",
  //   );
  //   done();
  // });
  // it("Check That The Quiz playerCanParticipate() Date Validation Returns Errors", (done) => {
  //   const startNotOk = moment().subtract(20, "days").toDate();
  //   const endNotOk = moment().subtract(10, "days").toDate();
  //   assert.isFalse(
  //     dateparser.playerCanParticipate(startNotOk, endNotOk),
  //     "Current Date Is Within A Valid Range, The Test Should Return False",
  //   );
  //   done();
  // });
});
