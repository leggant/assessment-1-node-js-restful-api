import chai from "chai";
import chaiHttp from "chai-http";
import { describe, it, before } from "mocha";
import app from "../../../app.js";
import PATHS from "../constants/paths.js";
import {
  ADMINTESTUSER,
  BASICTESTUSER1,
  TESTQUIZZES,
} from "../../../utils/unitTestDataRequests.js";

chai.use(chaiHttp);

describe("Admin User Quiz Requests", () => {
  /**
   * @type {String} token - admin user token returned from the before function login request (preflight)
   */
  let token;
  /**
   * @type {String} basicUserToken - basic user token returned from the before function login request (preflight)
   */
  let basicUserToken;
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
      });
    chai
      .request(app)
      .post(`${PATHS.BASE}${PATHS.LOGIN}`)
      .send({
        email: BASICTESTUSER1.email,
        password: BASICTESTUSER1.password,
      })
      .end((err2, loginRes2) => {
        // eslint-disable-next-line prefer-destructuring
        basicUserToken = loginRes2.body.token;
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
              questionCount: TESTQUIZZES[0].numQuestions,
              quizStartDate,
              quizEndDate,
            });
          done();
        });
    });
  });
  /**
   * Test Failed POST request - Basic User Failed Attempt to Create a New Quiz
   */
  describe(`POST: Unauthorised Attempt to Create a New Quiz`, () => {
    it("Should NOT Create A New Quiz", (done) => {
      chai
        .request(app)
        .post(`${PATHS.BASE}${PATHS.ADMIN.QUIZ}`)
        .send(TESTQUIZZES[1])
        .auth(basicUserToken, { type: "bearer" })
        .end((failError, createFailRes) => {
          chai
            .expect(createFailRes)
            .to.have.header("content-type", "application/json; charset=utf-8");
          chai
            .expect(createFailRes)
            .to.have.header("x-permitted-cross-domain-policies", "none");
          chai
            .expect(createFailRes)
            .to.have.header("access-control-allow-origin", "*");
          chai
            .expect(createFailRes)
            .to.have.header("x-dns-prefetch-control", "off");
          chai
            .expect(createFailRes)
            .to.have.header("x-download-options", "noopen");
          chai
            .expect(createFailRes)
            .to.have.header("x-content-type-options", "nosniff");
          chai.expect(createFailRes).to.have.header("x-xss-protection", "0");
          chai
            .expect(createFailRes)
            .to.have.header(
              "content-security-policy",
              "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
            );
          chai.expect(createFailRes).status(401);
          chai
            .expect(createFailRes.body)
            .to.have.property("msg", "Admin Only: Request not permitted");
          done();
        });
    });
  });
  /**
   * Test GET request - get a quiz by id
   */
  describe(`GET: (Admin) Query Quiz Data By ID`, () => {
    it("Should Get The New Quiz By Id", (done) => {
      chai
        .request(app)
        .get(`${PATHS.BASE}${PATHS.ADMIN.QUIZ}/${quizId}`)
        .auth(token, { type: "bearer" })
        .end((_error, qRes) => {
          chai
            .expect(qRes)
            .to.have.header("content-type", "application/json; charset=utf-8");
          chai.expect(qRes).to.have.header("x-content-type-options", "nosniff");
          chai.expect(qRes).to.have.header("x-xss-protection", "0");
          chai
            .expect(qRes)
            .to.have.header(
              "content-security-policy",
              "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
            );
          chai.expect(qRes).status(200);
          chai.expect(qRes.body.data).to.be.an("object");
          chai
            .expect(qRes.body.data.questions)
            .to.be.an("array")
            .to.have.lengthOf(10);
          chai.expect(qRes.body.data).to.have.property("id");
          chai.expect(qRes).to.have.nested.property("body.data.categoryId");
          chai.expect(qRes).to.have.nested.property("body.data.name");
          chai.expect(qRes).to.have.nested.property("body.data.answerType");
          chai.expect(qRes).to.have.nested.property("body.data.difficulty");
          chai
            .expect(qRes)
            .to.have.nested.property("body.data.numQuestions", 10);
          chai.expect(qRes).to.have.nested.property("body.data.startDate");
          chai.expect(qRes).to.have.nested.property("body.data.endDate");
          chai
            .expect(qRes)
            .to.have.nested.property("body.data.questions")
            .has.length(10);
          chai
            .expect(qRes)
            .to.have.nested.property("body.data.userParticipateQuiz");
          chai.expect(qRes).to.have.nested.property("body.data.userScores");
          done();
        });
    });
    it("Should Block Basic Users Querying Quiz By Id", (done) => {
      chai
        .request(app)
        .get(`${PATHS.BASE}${PATHS.ADMIN.QUIZ}/${quizId}`)
        .auth(basicUserToken, { type: "bearer" })
        .end((error10x, bRes) => {
          chai.expect(bRes).status(401);
          done();
        });
    });
  });
  /**
   * Test GET request - get all quizzes
   */
  describe(`GET: (Admin) Get All Quiz Data`, () => {
    it("Should Return All Quiz Information", (done) => {
      chai
        .request(app)
        .get(`${PATHS.BASE}${PATHS.ADMIN.QUIZ}`)
        .auth(token, { type: "bearer" })
        .end((_error, qRes) => {
          chai
            .expect(qRes)
            .to.have.header("content-type", "application/json; charset=utf-8");
          chai.expect(qRes).to.have.header("x-content-type-options", "nosniff");
          chai.expect(qRes).to.have.header("x-xss-protection", "0");
          chai
            .expect(qRes)
            .to.have.header(
              "content-security-policy",
              "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
            );
          chai.expect(qRes).status(200);
          chai.expect(qRes.body).to.be.an("object");
          chai
            .expect(qRes.body.data)
            .to.be.an("array")
            .to.have.length.greaterThanOrEqual(1);
          done();
        });
    });
    it("Should Block Basic User Accessing All Quiz Information", (done) => {
      chai
        .request(app)
        .get(`${PATHS.BASE}${PATHS.ADMIN.QUIZ}`)
        .auth(basicUserToken, { type: "bearer" })
        .end((error20x, bRes2) => {
          chai.expect(bRes2).status(401);
          done();
        });
    });
  });
  /**
   * Test PUT request - Update a quiz by id
   */
  describe(`PUT: Update Quiz Name by ID`, () => {
    it("Should Update The New Quiz Name", (done) => {
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

// describe("Admin User Quiz Requests With Error Handling", () => {
//   /**
//    * Test POST request - Create a new quiz
//    */
//   describe(`POST: ${PATHS.BASE}${PATHS.ADMIN.QUIZ}`, () => {});
//   /**
//    * Test PUT request - Update a quiz by id
//    */
//   describe(`PUT: ${PATHS.BASE}${PATHS.ADMIN.QUIZQUERY}`, () => {});
//   /**
//    * Test DELETE request - delete a quiz by id
//    */
//   describe(`PUT: ${PATHS.BASE}${PATHS.ADMIN.QUIZQUERY}`, () => {});
//   /**
//    * Test GET request - get a quiz by id
//    */
//   describe(`GET: ${PATHS.BASE}${PATHS.ADMIN.QUIZQUERY}`, () => {});
//   /**
//    * Test GET request - get all quizzes
//    */
//   describe(`GET: ${PATHS.BASE}${PATHS.ADMIN.QUIZ}`, () => {});
// });
