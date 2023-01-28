import { assert, expect } from "chai";
import { describe, it } from "mocha";
import * as axios from "../../../utils/axiosRequests.js";

describe("Test Gist Seeder endpoints with axioRequests.js Util Functions", () => {
  it("test gist endpoint to get user data", (done) => {
    const userReq = new Promise((resolve) => {
      resolve(axios.getUsers());
    });
    userReq.then((res) => {
      assert.isArray(res.users);
    });
    done();
  });
});
