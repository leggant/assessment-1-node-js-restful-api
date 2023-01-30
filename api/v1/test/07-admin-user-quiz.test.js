import chai from "chai";
import chaiHttp from "chai-http";
import { describe, it } from "mocha";
import app from "../../../app.js";
import PATHS from "../constants/paths.js";
import { ADMINTESTUSER } from "../../../utils/unitTestDataRequests.js";

chai.use(chaiHttp);

const BASE = "/api/v1";
let token;

describe("Admin User Quiz Request Tests", () => {
  describe("Create Quiz Request Test", () => {});
  describe("Update Quiz Request Test", () => {});
  describe("Delete Quiz Request Test", () => {});
  describe("Admin User Quiz Request Error Handling Tests", () => {
    describe("Admin Play Quiz Request Test w/ Errors", () => {});
    describe("Create Quiz Request Test w/ Errors", () => {});
    describe("Update Quiz Request Test w/ Errors", () => {});
    describe("Delete Quiz Request Test w/ Errors", () => {});
  });
});
