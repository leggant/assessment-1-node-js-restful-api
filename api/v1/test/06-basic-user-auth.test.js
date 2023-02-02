import chai from "chai";
import chaiHttp from "chai-http";
import { describe, it } from "mocha";
import app from "../../../app.js";
import PATHS from "../constants/paths.js";
import { BASICTESTUSER } from "../../../utils/unitTestDataRequests.js";

chai.use(chaiHttp);

describe("Basic User Registration and Login Tests", () => {
  describe(`POST: ${PATHS.BASE}${PATHS.REGISTER}`, () => {
    it("Should register basic user, if they do not exist", (done) => {
      chai
        .request(app)
        .post(`${PATHS.BASE}${PATHS.REGISTER}`)
        .send(BASICTESTUSER)
        .end((_, res) => {
          chai.expect(res.status).to.be.equal(201);
          chai.expect(res.body).to.be.a("object");
          chai
            .expect(res.body.msg)
            .to.be.equal(
              `New User: ${BASICTESTUSER.userName} Successfully Registered`,
            );
          done();
        });
    });
    it("Should fail to register an basic user that already exists", (done) => {
      chai
        .request(app)
        .post(`${PATHS.BASE}${PATHS.REGISTER}`)
        .send(BASICTESTUSER)
        .end((_, res) => {
          chai.expect(res.status).to.be.equal(409);
          chai.expect(res.body).to.be.a("object");
          chai
            .expect(res.body.msg)
            .to.be.equal(
              `${BASICTESTUSER.firstName} ${BASICTESTUSER.lastName} already exists. Please Login`,
            );
          done();
        });
    });
  });
  describe(`POST: ${PATHS.BASE}${PATHS.LOGIN}`, () => {
    it("Should login basic user", (done) => {
      const { email, password } = BASICTESTUSER;
      chai
        .request(app)
        .post(`${PATHS.BASE}${PATHS.LOGIN}`)
        .send({
          email,
          password,
        })
        .end((_, res) => {
          chai.expect(res.status).to.be.equal(200);
          chai.expect(res.body).to.be.a("object");
          chai.expect(res.body.token, { type: "bearer" });
          chai
            .expect(res.body.msg)
            .to.be.equal(`${BASICTESTUSER.userName} - successfully logged in`);
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
          chai.expect(res.status).to.be.equal(400);
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
      const { email } = BASICTESTUSER;
      chai
        .request(app)
        .post(`${PATHS.BASE}${PATHS.LOGIN}`)
        .send({
          email,
          password: "fail",
        })
        .end((_, res) => {
          chai.expect(res.status).to.be.equal(400);
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
      const { password, userName } = BASICTESTUSER;
      chai
        .request(app)
        .post(`${PATHS.BASE}${PATHS.LOGIN}`)
        .send({
          email: userName,
          password,
        })
        .end((_, res) => {
          chai.expect(res.status).to.be.equal(400);
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

export default BASICTESTUSER;
