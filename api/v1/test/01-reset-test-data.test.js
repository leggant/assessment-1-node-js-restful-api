import { before, after } from "mocha";
import {
  deleteTestAdminUser,
  deleteTestBasicUser,
  deleteTestQuizzes,
} from "../../../utils/unitTestDataRequests.js";

// Before each test, clear all test data
// before((done) => {
//   const result = Promise.all([
//     deleteTestQuizzes(),
//     deleteTestAdminUser(),
//     // deleteTestBasicUser(),
//   ]);
//   result.then(() => {
//     done();
//   });
// });

// After each test, clear all test data
after((done) => {
  const result = Promise.all([
    deleteTestQuizzes(),
    deleteTestAdminUser(),
    deleteTestBasicUser(),
  ]);
  result.then(() => {
    console.info("Test Users and Quizzes Deleted");
    done();
  });
});
