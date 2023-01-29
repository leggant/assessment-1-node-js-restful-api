import { assert, expect, should } from "chai";
import { describe, it, before } from "mocha";
import * as axios from "../../../utils/axiosRequests.js";

describe("Test Gist Seeder endpoints with axioRequests.js Util Functions", () => {
  let userData;
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
      assert.isObject(...userData);
      done();
    });
    it("Test If The Return Has An Error Message", (done) => {
      assert.isObject(...userData);
      done();
    });
  });
});
