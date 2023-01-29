import chai from "chai";
import chaiHttp from "chai-http";
import { describe, it } from "mocha";
import app from "../../../app.js";
import PATHS from "../constants/paths.js";
import { ADMINTESTUSER } from "../../../utils/unitTestDataRequests.js";

chai.use(chaiHttp);

const BASE = "/api/v1";
let token;

describe("Admin User Authentication and Auth Request Validation", () => {
  it("should login admin user with valid input", (done) => {
    const { email, password } = ADMINTESTUSER;
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
          .to.be.equal(`${ADMINTESTUSER.userName} - successfully logged in`);
        done();
      });
  });

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
    const { email } = ADMINTESTUSER;
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
    const { password, userName } = ADMINTESTUSER;
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

export default ADMINTESTUSER;
