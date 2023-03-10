/**
 * @file app.js - entry point to the quiz API
 * @author Anthony Legg
 * @link @leggant
 */
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";

import loginRegisterRouter from "./api/v1/routes/userAuthRouter.js";
import userProfileRouter from "./api/v1/routes/userProfileRouter.js";
import adminQuizRouter from "./api/v1/routes/adminQuizRouter.js";
import playerQuizRouter from "./api/v1/routes/playerQuizRouter.js";
import seederRouter from "./api/v1/routes/seederRouter.js";

/**
 * initialise a instance of dotenv
 * @constructor dotenv
 * @example dotenv.config();
 */
dotenv.config();

/**
 * initialise a global instance of ExpressJS
 * @constructor express
 * @example const app = express();
    app.use(morgan("dev"));
    app.use(cors());
    app.use(helmet());
    app.use(express.urlencoded({ extended: false }));
    app.use(compression());
    app.use(express.json());
 */
const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(express.json());
/**
 * Defines the base value for all API routes
 * @default api
 * @const {String} BASE_PATH
 */
const BASE_PATH = "api";
/**
 * Defines the current version of the API. This is provided by an environment variable
 * @default v1
 * @const {String} API_VERSION - current api version is v1
 */
// eslint-disable-next-line prefer-destructuring
const API_VERSION = process.env.API_VERSION;
app.use(`/docs/${BASE_PATH}/${API_VERSION}`, express.static("docs"));

/**
 * Set the server port. The default port in the development env is 3000
 * @default 3000
 * @const {number} SERVER_PORT - server port number
 */
const SERVER_PORT = process.env.PORT || 3000;

app.get(`/${BASE_PATH}/${API_VERSION}`, (req, res) => {
  res.json({ msg: `/${BASE_PATH}/${API_VERSION}` });
});
app.use(`/${BASE_PATH}/${API_VERSION}`, loginRegisterRouter);
app.use(`/${BASE_PATH}/${API_VERSION}`, userProfileRouter);
app.use(`/${BASE_PATH}/${API_VERSION}`, adminQuizRouter);
app.use(`/${BASE_PATH}/${API_VERSION}`, playerQuizRouter);
app.use(`/${BASE_PATH}/${API_VERSION}`, seederRouter);
app.listen(SERVER_PORT, () => {
  console.log(`Server is listening on port ${SERVER_PORT}`);
});

/**
 * @export app - export app for use in API Unit Tests
 */
export default app;
