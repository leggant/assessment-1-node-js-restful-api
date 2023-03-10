import { assert, expect } from "chai";
import { describe, it, before } from "mocha";
import * as axios from "../../../utils/axiosRequests.js";
import USERTYPE from "../constants/userType.js";

describe("Test Gist Seeder endpoints with axioRequests.js Util Functions", () => {
  let userData;
  let categories;
  before(async () => {
    const data = await axios.getUsers();
    userData = await data.users;
  });
  describe("Test The Data Return From The Axios Request", () => {
    it("The Data is an object", (done) => {
      assert.isObject(...userData);
      done();
    });
    it("Test The Data Has Required Keys", (done) => {
      expect(...userData).to.have.all.keys([
        "firstName",
        "lastName",
        "userName",
        "email",
        "role",
        "password",
        "confirmPassword",
      ]);
      done();
    });
    it("Test User Roles Are Of The Correct Type", (done) => {
      expect(...userData)
        .to.have.property("role")
        .that.is.oneOf([USERTYPE.ADMIN, USERTYPE.BASIC]);
      done();
    });
    it("Test User Passwords Conform to Regex Requirements", (done) => {
      expect(...userData.map((data) => data))
        .to.have.property("password")
        .to.match(/^(?=.*[0-9])(?=.*[!@#$%^&amp;*])(?=\S{8,16}$).*$/);
      done();
    });
    it("Test Usernames and Email Addresses match", (done) => {
      const check = userData.every((obj) => obj.email.startsWith(obj.userName));
      assert.isTrue(check);
      done();
    });
    it("Test An Error Has Not Been Returned", (done) => {
      expect(userData).to.not.be.an.instanceOf(Error);
      done();
    });
  });
  before(async () => {
    categories = await axios.getCategories();
  });
  describe("Test The Category Data Is Returned From The Axios Request Module", () => {
    it("The Data is an object", (done) => {
      assert.isObject(...categories);
      done();
    });
    it("Test The Data Has Required Keys", (done) => {
      expect(...categories).to.have.all.keys(["id", "name"]);
      done();
    });
    it("Test An Error Has Not Been Returned", (done) => {
      expect(categories).to.not.be.an.instanceOf(Error);
      done();
    });
  });
});
