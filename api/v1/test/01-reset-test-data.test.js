import { before, after } from "mocha";
import {
  deleteTestAdminUser,
  deleteTestBasicUser,
} from "../../../utils/unitTestDataRequests.js";

// Before each test, clear all test data
// before((done) => {
//   const result = Promise.all([deleteTestAdminUser(), deleteTestBasicUser()]);
//   result.then(() => {
//     done();
//   });
// });

// After each test, clear all test data
after((done) => {
  const result = Promise.all([deleteTestAdminUser(), deleteTestBasicUser()]);
  result.then(() => {
    console.info("Test Admin and Basic Users Deleted");
    done();
  });
});
