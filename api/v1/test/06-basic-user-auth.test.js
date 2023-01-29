import chai from "chai";
import chaiHttp from "chai-http";
import { describe, it } from "mocha";
import app from "../../../app.js";
import PATHS from "../constants/paths.js";
import { BASICTESTUSER } from "../../../utils/unitTestDataRequests.js";

chai.use(chaiHttp);

const BASE = "/api/v1";
let token;

describe("Basic User Registration and Login Tests", () => {
  describe("Basic User Registration Tests", () => {
    it("should register basic user with valid input if they do not exist", (done) => {
      chai
        .request(app)
        .post(`${BASE}${PATHS.REGISTER}`)
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
  });
  describe("Basic User Registration Tests With Error Responses", () => {
    it("should refuse to register an basic user if the user already exists", (done) => {
      chai
        .request(app)
        .post(`${BASE}${PATHS.REGISTER}`)
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
  describe("Basic User Login Tests", () => {
    it("should login basic user with valid input", (done) => {
      const { email, password } = BASICTESTUSER;
      chai
        .request(app)
        .post(`${BASE}${PATHS.LOGIN}`)
        .send({
          email,
          password,
        })
        .end((_, res) => {
          chai.expect(res.status).to.be.equal(200);
          chai.expect(res.body).to.be.a("object");
          chai
            .expect(res.body.msg)
            .to.be.equal(`${BASICTESTUSER.userName} - successfully logged in`);
          done();
        });
    });
  });
  describe("Basic User Login Tests With Error Handling", () => {
    it("should output login validation errors due to invalid request input", (done) => {
      chai
        .request(app)
        .post(`${BASE}${PATHS.LOGIN}`)
        .send({
          email: "thisshould",
          password: "fail",
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
    it("should output login validation error due to invalid password", (done) => {
      const { email } = BASICTESTUSER;
      chai
        .request(app)
        .post(`${BASE}${PATHS.LOGIN}`)
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
          // chai.expect(res.body.errors[0]).to.include(
          //   {
          //     value: "fail",
          //     msg: "Password must have at least 8 characters, one number and one special character",
          //     param: "password",
          //     location: "body",
          //   },
          //   {
          //     value: "fail",
          //     msg: "Password must be 8 char min and 16 char max lengths",
          //     param: "password",
          //     location: "body",
          //   },
          // );
          done();
        });
    });
    it("should output login validation error due to invalid email format", (done) => {
      const { password, userName } = BASICTESTUSER;
      chai
        .request(app)
        .post(`${BASE}${PATHS.LOGIN}`)
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
