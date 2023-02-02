import chai from "chai";
import chaiHttp from "chai-http";
import { describe, it, before } from "mocha";
import app from "../../../app.js";
import PATHS from "../constants/paths.js";
import {
  ADMINTESTUSER,
  TESTQUIZZES,
} from "../../../utils/unitTestDataRequests.js";

chai.use(chaiHttp);

describe("Admin User Quiz Requests", () => {
  /**
   * @type {String} token - token return from the before function login request (preflight)
   */
  let token;
  /**
   * login admin user before running tests
   */
  /**
   * @type {Number} quizId - quiz id returned from the create new quiz test
   */
  let quizId;
  /**
   * login admin user before running tests
   */
  before((done) => {
    const { email, password } = ADMINTESTUSER;
    chai
      .request(app)
      .post(`${PATHS.BASE}${PATHS.LOGIN}`)
      .send({
        email,
        password,
      })
      .end((err, loginRes) => {
        // eslint-disable-next-line prefer-destructuring
        token = loginRes.body.token;
        done();
      });
  });
  /**
   * Test POST request - Create a new quiz
   */
  describe(`POST: Create a New Quiz`, () => {
    it("Should Create A New Quiz", (done) => {
      chai
        .request(app)
        .post(`${PATHS.BASE}${PATHS.ADMIN.QUIZ}`)
        .send(TESTQUIZZES[0])
        .auth(token, { type: "bearer" })
        .end((err1, createRes) => {
          const { id, quizStartDate, quizEndDate } = createRes.body.data;
          quizId = Number(id);
          chai
            .expect(createRes.body)
            .to.be.an("object")
            .and.to.have.deep.property("data", {
              id,
              name: `${TESTQUIZZES[0].name}`,
              difficulty: `${TESTQUIZZES[0].difficulty}`,
              answerType: `${TESTQUIZZES[0].answerType}`,
              questionCount: Number(TESTQUIZZES[0].numQuestions),
              quizStartDate,
              quizEndDate,
            });
          done();
        });
    });
  });
  /**
   * Test GET request - get a quiz by id
   */
  describe(`GET: ${PATHS.BASE}${PATHS.ADMIN.QUIZQUERY}`, () => {});
  /**
   * Test GET request - get all quizzes
   */
  describe(`GET: ${PATHS.BASE}${PATHS.ADMIN.QUIZ}`, () => {});
  /**
   * Test PUT request - Update a quiz by id
   */
  describe(`PUT: Update Quiz Name by ID`, () => {
    it("Should Update The New Quizzes Name", (done) => {
      chai
        .request(app)
        .put(`${PATHS.BASE}${PATHS.ADMIN.QUIZ}/${quizId}`)
        .send({ name: "Yogis Updated Quiz Name" })
        .auth(token, { type: "bearer" })
        .end((err4, updateRes) => {
          const { updateResult } = updateRes.body;
          const { startDate, endDate } = updateResult;
          chai
            .expect(updateRes.body)
            .to.have.property(
              "msg",
              "Yogis Updated Quiz Name Updated Successfully",
            );
          chai.expect(updateRes.body).to.have.deep.property("updateResult", {
            categoryId: TESTQUIZZES[0].categoryId,
            name: "Yogis Updated Quiz Name",
            startDate,
            endDate,
          });
          chai.expect(updateRes).status(200);
          done();
        });
    });
  });
  /**
   * Test DELETE request - delete a quiz by id
   */
  describe(`DELETE: Delete Quiz by ID`, () => {
    it("Should Delete The New Quiz By Id", (done) => {
      chai
        .request(app)
        .delete(`${PATHS.BASE}${PATHS.ADMIN.QUIZ}/${quizId}`)
        .auth(token, { type: "bearer" })
        .end((_error, deleteRes) => {
          chai.expect(deleteRes).status(200);
          chai.expect(deleteRes.body).to.be.an("object");
          chai
            .expect(deleteRes)
            .to.have.header("content-type", "application/json; charset=utf-8");
          chai
            .expect(deleteRes)
            .to.have.header("x-content-type-options", "nosniff");
          chai.expect(deleteRes).to.have.header("x-xss-protection", "0");
          chai
            .expect(deleteRes)
            .to.have.header(
              "content-security-policy",
              "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
            );
          chai
            .expect(deleteRes.body)
            .to.have.property("msg", `Quiz ID #${quizId} Deleted.`);
          done();
        });
    });
  });
});

describe("Admin User Quiz Requests With Error Handling", () => {
  /**
   * Test POST request - Create a new quiz
   */
  describe(`POST: ${PATHS.BASE}${PATHS.ADMIN.QUIZ}`, () => {});
  /**
   * Test PUT request - Update a quiz by id
   */
  describe(`PUT: ${PATHS.BASE}${PATHS.ADMIN.QUIZQUERY}`, () => {});
  /**
   * Test DELETE request - delete a quiz by id
   */
  describe(`PUT: ${PATHS.BASE}${PATHS.ADMIN.QUIZQUERY}`, () => {});
  /**
   * Test GET request - get a quiz by id
   */
  describe(`GET: ${PATHS.BASE}${PATHS.ADMIN.QUIZQUERY}`, () => {});
  /**
   * Test GET request - get all quizzes
   */
  describe(`GET: ${PATHS.BASE}${PATHS.ADMIN.QUIZ}`, () => {});
});

//   describe("Create Quiz Request Test", () => {
//     it("tes", (done) => {
//       const { email, password } = ADMINTESTUSER;
//       chai
//         .request(app)
//         .post(`${BASE}${PATHS.LOGIN}`)
//         .send({
//           email,
//           password,
//         })
//         .end((_, loginRes) => {
//           chai
//             .request(app)
//             .post(`${BASE}${PATHS.ADMIN.QUIZ}`)
//             .auth(loginRes.body.token, { type: "bearer" });
//           // .send(TESTQUIZZES[0])
//           // .end((__, quizRes) => {
//           //   chai.expect(quizRes.status).to.be.equal(201);
//           //   chai.expect(quizRes.body).to.be.a("object");
//           //   chai
//           //     .expect(quizRes.body.msg)
//           //     .to.be.equal("institution successfully created");
//           // });
//           done();
//         });
//     });
//   });
//   // describe("Update Quiz Request Test", () => {});
//   // describe("Delete Quiz Request Test", () => {});
//   // describe("Admin User Quiz Request Error Handling Tests", () => {
//   //   describe("Admin Play Quiz Request Test w/ Errors", () => {});
//   //   describe("Create Quiz Request Test w/ Errors", () => {});
//   //   describe("Update Quiz Request Test w/ Errors", () => {});
//   //   describe("Delete Quiz Request Test w/ Errors", () => {});
//   // });
// });
