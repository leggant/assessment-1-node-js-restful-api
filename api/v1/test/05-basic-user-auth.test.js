import chai from "chai";
import chaiHttp from "chai-http";
import { describe, it } from "mocha";
import app from "../../../app.js";
import PATHS from "../constants/paths.js";
import { BASICTESTUSER1 } from "../../../utils/unitTestDataRequests.js";

/**
 * @type {String} basicUserToken - basic user token returned from the before function login request (preflight)
 */
let basicUserToken;

chai.use(chaiHttp);

describe("Basic User Registration and Login Tests", () => {
  describe(`POST: Register Users`, () => {
    it("Should register basic user #1, if they do not exist", (done) => {
      chai
        .request(app)
        .post(`${PATHS.BASE}${PATHS.REGISTER}`)
        .send(BASICTESTUSER1)
        .end((_, res) => {
          chai.expect(res).status(201);
          chai.expect(res.body).to.be.a("object");
          chai
            .expect(res.body.msg)
            .to.be.equal(
              `New User: ${BASICTESTUSER1.userName} Successfully Registered`,
            );
          done();
        });
    });
    it("Should fail to register an basic user that already exists", (done) => {
      chai
        .request(app)
        .post(`${PATHS.BASE}${PATHS.REGISTER}`)
        .send(BASICTESTUSER1)
        .end((_, res) => {
          chai.expect(res).status(409);
          chai.expect(res.body).to.be.a("object");
          chai
            .expect(res.body.msg)
            .to.be.equal(
              `${BASICTESTUSER1.firstName} ${BASICTESTUSER1.lastName} already exists. Please Login`,
            );
          done();
        });
    });
  });
  describe(`POST: ${PATHS.BASE}${PATHS.LOGIN}`, () => {
    it("Should login basic user", (done) => {
      const { email, password } = BASICTESTUSER1;
      chai
        .request(app)
        .post(`${PATHS.BASE}${PATHS.LOGIN}`)
        .send({
          email,
          password,
        })
        .end((_, res) => {
          basicUserToken = res.body.token;
          chai.expect(res).status(200);
          chai.expect(res.body).to.be.a("object");
          chai.expect(res.body.token, { type: "bearer" });
          chai
            .expect(res.body.msg)
            .to.be.equal(`${BASICTESTUSER1.userName} - successfully logged in`);
          done();
        });
    });
    it("Should return Basic Users Profile Data", (done) => {
      chai
        .request(app)
        .get(`${PATHS.BASE}${PATHS.USER.PROFILE}`)
        .auth(basicUserToken, { type: "bearer" })
        .end((_, profileRes) => {
          chai.expect(profileRes).status(200);
          done();
        });
    });
    it("Should return validation errors due to invalid request input", (done) => {
      chai
        .request(app)
        .post(`${PATHS.BASE}${PATHS.LOGIN}`)
        .send({
          email: "thisshould",
          password: "fail",
        })
        .end((_, res) => {
          chai.expect(res).status(400);
          chai.expect(res.body).to.be.a("object");
          chai.assert.notExists(
            res.body.token,
            "login should fail, no token should be returned",
          );
          chai
            .expect(res.body.errors[0])
            .to.have.all.keys("msg", "param", "nestedErrors");
          chai.expect(res.body.errors[0]).to.include({
            msg: "Invalid value(s)",
            param: "_error",
          });
          chai
            .expect(res.body.errors[1])
            .to.have.all.keys("value", "msg", "param", "location");
          chai.expect(res.body.errors[1]).to.include({
            value: "fail",
            msg: "Password must have at least 8 characters, one number and one special character",
            param: "password",
            location: "body",
          });
          done();
        });
    });
    it("Should return validation error due to invalid password", (done) => {
      const { email } = BASICTESTUSER1;
      chai
        .request(app)
        .post(`${PATHS.BASE}${PATHS.LOGIN}`)
        .send({
          email,
          password: "fail",
        })
        .end((_, res) => {
          chai.expect(res).status(400);
          chai.expect(res.body).to.be.a("object");
          chai
            .expect(res.body.errors[0])
            .to.have.all.keys("value", "msg", "param", "location");
          chai.expect(res.body.errors).to.deep.equal(
            [
              {
                value: "fail",
                msg: "Password must have at least 8 characters, one number and one special character",
                param: "password",
                location: "body",
              },
              {
                value: "fail",
                msg: "Password must be 8 char min and 16 char max lengths",
                param: "password",
                location: "body",
              },
            ],
            "correct error params passed",
          );
          done();
        });
    });
    it("Should return validation error due to invalid email format", (done) => {
      const { password, userName } = BASICTESTUSER1;
      chai
        .request(app)
        .post(`${PATHS.BASE}${PATHS.LOGIN}`)
        .send({
          email: userName,
          password,
        })
        .end((_, res) => {
          chai.expect(res).status(400);
          chai.expect(res.body).to.be.a("object");
          chai
            .expect(res.body.errors[0])
            .to.have.all.keys("msg", "param", "nestedErrors");
          chai.expect(res.body.errors[0]).to.include({
            msg: "Invalid value(s)",
            param: "_error",
          });
          done();
        });
    });
  });
});

export default BASICTESTUSER1;
