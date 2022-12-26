import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

import loginRegisterRouter from "./api/v1/routes/userAuthRouter.js";
import userProfileRouter from "./api/v1/routes/userProfileRouter.js";
import userSeederRouter from "./api/v1/routes/seedUsersRouter.js";
/**
 * @constructor dotenv
 * @description initialise a instance of dotenv
 * @example dotenv.config();
 */
dotenv.config();
/**
 * @constructor express
 * @description initialise a global instance of ExpressJS
 * @example const app = express();
app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
 */
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
/**
 * Defines the base value for all API routes
 * @constant {string} BASE_PATH
 * @default api
 * @type {string}
 */
const BASE_PATH = "api";
/**
 * Defines the current version of the API. This is provided by an environment variable
 * @default v1
 * @type {string}
 */
const API_VERSION = process.env.API_VERSION || "v1";
app.use(`/${BASE_PATH}/${API_VERSION}/docs`, express.static("docs"));
/**
 * Set the server port. The default port in the development env is 3000
 * @default 3000
 * @type {number}
 */
const SERVER_PORT = process.env.PORT;

app.get(`/${BASE_PATH}/${API_VERSION}`, (req, res) => {
  res.json({ msg: `/${BASE_PATH}/${API_VERSION}` });
});
app.use(`/${BASE_PATH}/${API_VERSION}`, loginRegisterRouter);
app.use(`/${BASE_PATH}/${API_VERSION}`, userProfileRouter);
app.use(`/${BASE_PATH}/${API_VERSION}`, userSeederRouter);
app.listen(SERVER_PORT, () => {
  console.log(`Server is listening on port ${SERVER_PORT}`);
});

export default app;
