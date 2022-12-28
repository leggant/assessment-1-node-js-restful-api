/**
 * User Related API Request Handler Methods
 * @module quizRequests
 */
import PRISMA from "./prisma.mjs";
import USERTYPE from "../api/v1/constants/userType.js";
import checkDataType from "./checkDataType.js";
import checkIfObjectIsEmpty from "./checkEmptyObject.js";
import { createQuizRequest } from "./axiosRequests.mjs";

const createNewQuiz = async (reqdata) => {};

// eslint-disable-next-line import/prefer-default-export
export { createNewQuiz };
