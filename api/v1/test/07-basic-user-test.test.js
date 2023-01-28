import chai from "chai";
import chaiHttp from "chai-http";
import { describe, it } from "mocha";
import app from "../../../app.js";
import PATHS from "../constants/paths.js";
import { BASICTESTUSER } from "../../../utils/unitTestDataRequests.js";

chai.use(chaiHttp);

const BASE = "/api/v1";

describe("auth", () => {
  it("should register admin user with valid input if they do not exist", (done) => {
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
  it("should refuse to register an admin user if the user already exists", (done) => {
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

  it("should login admin user with valid input", (done) => {
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

export default BASICTESTUSER;
