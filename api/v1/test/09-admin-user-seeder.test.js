import chai from "chai";
import chaiHttp from "chai-http";
import { describe, it } from "mocha";
import app from "../../../app.js";
import PATHS from "../constants/paths.js";
import { ADMINTESTUSER } from "../../../utils/unitTestDataRequests.js";

chai.use(chaiHttp);

const BASE = "/api/v1";
let token;

describe("Test Data Seeder Endpoints", () => {
  describe("Test User Data Seeder Endpoint", () => {});
  describe("Test Category Data Seeder Endpoint", () => {});
});
