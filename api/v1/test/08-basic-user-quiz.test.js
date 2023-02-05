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

describe(`Login as An Admin, Create A New Quiz, Login As A Player/Assign Self To Quiz`, () => {
  /**
   * @constant {String} adminToken - admin user token returned from the before function login request
   */
  let adminToken;
  /**
   * @constant {String} playerToken - basic user token returned from the before function login request
   */
  let playerToken;
  /**
   * @constant {Number} quizId - quiz id returned from the create new quiz test
   */
  let quizId;

  it("Add A Player To A Quiz", (done) => {
    chai
      .request(app)
      .post(`${PATHS.BASE}${PATHS.LOGIN}`)
      .send({
        email: ADMINTESTUSER.email,
        password: ADMINTESTUSER.password,
      })
      .end((err1, adminRes) => {
        console.info("Logged In As Admin");
        // eslint-disable-next-line prefer-destructuring
        adminToken = adminRes.body.token;
        chai.expect(adminRes).status(200);
        chai
          .request(app)
          .post(`${PATHS.BASE}${PATHS.ADMIN.QUIZ}`)
          .send(TESTQUIZZES[0])
          .auth(adminToken, { type: "bearer" })
          .end((err3, createRes) => {
            // eslint-disable-next-line prefer-destructuring
            const { id } = createRes.body.data;
            quizId = Number(id);
            chai.expect(createRes).status(201);
            console.info(`Quiz #${quizId} Created`);
            chai
              .request(app)
              .post(`${PATHS.BASE}${PATHS.LOGIN}`)
              .send({
                email: BASICTESTUSER1.email,
                password: BASICTESTUSER1.password,
              })
              .end((err2, loginRes) => {
                // eslint-disable-next-line prefer-destructuring
                playerToken = loginRes.body.token;
                console.info("Logged In As Player");
                chai
                  .request(app)
                  .post(`${PATHS.BASE}${PATHS.QUIZ.PLAYERTEST}${quizId}`)
                  .auth(playerToken, { type: "bearer" })
                  .end((err4, addRes) => {
                    chai.expect(addRes).status(201);
                    console.info(
                      `Assigned Player: ${BASICTESTUSER1.userName} to Quiz #${quizId}`,
                    );
                    chai
                      .expect(addRes.body)
                      .to.have.property(
                        "msg",
                        `${BASICTESTUSER1.userName} was successfully added to the quiz #${quizId}.`,
                      );
                    chai
                      .expect(addRes.body.data)
                      .to.have.property("name", `${TESTQUIZZES[0].name}`);
                    chai
                      .expect(addRes.body.data)
                      .to.have.property(
                        "categoryId",
                        TESTQUIZZES[0].categoryId,
                      );
                    chai
                      .expect(addRes.body.data)
                      .to.have.property(
                        "answerType",
                        `${TESTQUIZZES[0].answerType}`,
                      );
                    chai
                      .expect(addRes.body.data)
                      .to.have.property(
                        "difficulty",
                        `${TESTQUIZZES[0].difficulty}`,
                      );
                    chai
                      .expect(addRes.body.data)
                      .to.have.property(
                        "numQuestions",
                        TESTQUIZZES[0].numQuestions,
                      );
                    chai.expect(addRes.body.data).to.have.property("startDate");
                    chai.expect(addRes.body.data).to.have.property("endDate");
                    chai.expect(addRes.body.data).to.have.property("category");
                    done();
                  });
              });
          });
      });
  });
});
