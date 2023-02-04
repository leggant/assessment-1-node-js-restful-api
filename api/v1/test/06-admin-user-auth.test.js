import chai from "chai";
import chaiHttp from "chai-http";
import { describe, it, before } from "mocha";
import app from "../../../app.js";
import PATHS from "../constants/paths.js";
import {
  ADMINTESTUSER,
  BASICTESTUSER1,
  BASICTESTUSER2,
} from "../../../utils/unitTestDataRequests.js";

/**
 * @type {String} token - admin user token returned from the login request
 */
let token;

chai.use(chaiHttp);

describe("Admin User Registration and Login Tests", () => {
  before((done) => {
    chai
      .request(app)
      .post(`${PATHS.BASE}${PATHS.REGISTER}`)
      .send(BASICTESTUSER2)
      .end((_, res) => {
        chai.expect(res).status(201);
        done();
      });
  });
  describe(`Admin User Registration Request Tests`, () => {
    it("Should register admin user, if they do not exist", (done) => {
      chai
        .request(app)
        .post(`${PATHS.BASE}${PATHS.REGISTER}`)
        .send(ADMINTESTUSER)
        .end((_, res) => {
          chai.expect(res).status(201);
          chai.expect(res.body).to.be.a("object");
          chai
            .expect(res.body.msg)
            .to.be.equal(
              `New User: ${ADMINTESTUSER.userName} Successfully Registered`,
            );
          done();
        });
    });
    it("Should fail to register an admin user that already exists", (done) => {
      chai
        .request(app)
        .post(`${PATHS.BASE}${PATHS.REGISTER}`)
        .send(ADMINTESTUSER)
        .end((_, res) => {
          chai.expect(res).status(409);
          chai.expect(res.body).to.be.a("object");
          chai
            .expect(res.body.msg)
            .to.be.equal(
              `${ADMINTESTUSER.firstName} ${ADMINTESTUSER.lastName} already exists. Please Login`,
            );
          done();
        });
    });
  });
  describe(`Admin User Login Request Tests`, () => {
    it("Should login admin user", (done) => {
      const { email, password } = ADMINTESTUSER;
      chai
        .request(app)
        .post(`${PATHS.BASE}${PATHS.LOGIN}`)
        .send({
          email,
          password,
        })
        .end((_, res) => {
          // eslint-disable-next-line prefer-destructuring
          token = res.body.token;
          chai.expect(res).status(200);
          chai.expect(res.body).to.be.a("object");
          chai.expect(res.body.token, { type: "bearer" });
          chai
            .expect(res.body.msg)
            .to.be.equal(`${ADMINTESTUSER.userName} - successfully logged in`);
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
      const { email } = ADMINTESTUSER;
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
      const { password, userName } = ADMINTESTUSER;
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
  describe("Admin User Profile Request Tests", () => {
    it("Should return Admin Users Profile Data", (done) => {
      chai
        .request(app)
        .get(`${PATHS.BASE}${PATHS.USER.PROFILE}`)
        .auth(token, { type: "bearer" })
        .end((_, profileRes) => {
          chai.expect(profileRes).status(200);
          done();
        });
    });
    it("Should return Basic Users Profile Data by username query", (done) => {
      chai
        .request(app)
        .get(
          `${PATHS.BASE}${PATHS.ADMIN.USERSEARCHTEST}userName/${BASICTESTUSER1.userName}`,
        )
        .auth(token, { type: "bearer" })
        .end((_, basicProfileRes) => {
          chai.expect(basicProfileRes).status(200);
          done();
        });
    });
    it("Should return Basic Users Profile Data by email query", (done) => {
      chai
        .request(app)
        .get(
          `${PATHS.BASE}${PATHS.ADMIN.USERSEARCHTEST}email/${BASICTESTUSER1.email}`,
        )
        .auth(token, { type: "bearer" })
        .end((_, basicProfileResEmail) => {
          chai.expect(basicProfileResEmail).status(200);
          done();
        });
    });
    it("Should Delete a Basic Users Profile", (done) => {
      chai
        .request(app)
        .delete(
          `${PATHS.BASE}${PATHS.ADMIN.USERSEARCHTEST}email/${BASICTESTUSER2.email}`,
        )
        .auth(token, { type: "bearer" })
        .end((_, deleteProfileResEmail) => {
          chai.expect(deleteProfileResEmail).status(200);
          done();
        });
    });
  });
});

export default ADMINTESTUSER;
