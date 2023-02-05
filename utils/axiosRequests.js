/**
 * Axios Request Module
 * @module axiosRequests
 */
import axios from "axios";
/**
 * create a reusable instance of axios, complete with base url, and allowed methods
 * @constructor axios
 * @version 1.2.0
 * @constant GISTAXIOS instance of axios created to target seeder endpoints
 * @description create a reusable instance of axios, complete with base url, and allowed methods
 * @see {@link https://axios-http.com/docs/instance|axios-http}
 * @example const instance = axios.create({
baseURL: 'https://some-domain.com/api/',
method: "GET",
timeout: 5000,
headers: {'X-Custom-Header': 'foobar'}
});
 */
const GISTAXIOS = axios.create({
  baseURL:
    "https://gist.githubusercontent.com/leggant/c88f9010d6664fa2f10a847c7102d933/raw/eb83f9678cb23e0042a6925df51c4c399a3a87e2",
  method: "GET",
});
/**
 * gist endpoint for admin user seeder
 * @const GISTADMIN
 * @type {string}
 * @description gist endpoint for admin user seeder
 * @default "/admin_user.json"
 */
const GISTADMIN = "/admin_user.json";
const GISTBASIC = "/basic_user.json";

/**
 * axios request function to collect user data from GitHub Gist endpoints
 * @async
 * @function getUsers
 * @returns {Response|Error}
 */
const getUsers = async () => {
  try {
    /**
     * axios' implementation of Promise.all. this will combine both the admin and basic user
     * endpoint requests into a single async/await
     * @constant {Object} res - users return from the completed axios.all request
     * @returns {Object} res
     */
    const res = await axios
      .all([GISTAXIOS.get(GISTADMIN), GISTAXIOS.get(GISTBASIC)])
      .then(
        /**
         * when the data has resolved, use the axios spread function to decouple the response objects;
         * order here must be the same used in the axios.all array
         */
        axios.spread((admin, basic) => {
          /**
           * merge the admin and basic users into a single array
           * return this back to the res constant
           */
          const users = admin.data.concat(basic.data);
          return { users };
        }),
      );
    return res;
  } catch (error) {
    console.error(error.message);
    return error;
  }
};

// Quizzes

const QUIZAXIOS = axios.create({
  baseURL: "https://opentdb.com",
  method: "GET",
});

// Quiz Categories

const CATENDPOINT = "/api_category.php";
const CREATEQUIZ = "/api.php";

const getCategories = async () => {
  try {
    const res = await QUIZAXIOS.get(CATENDPOINT);
    const data = await res.data;
    return data.trivia_categories;
  } catch (error) {
    console.error(error.message);
    return error;
  }
};

// Quiz Admin

const createQuizOpenTDBRequest = async (query) => {
  try {
    const reqString = `${CREATEQUIZ}?category=${query.category}&amount=${query.amount}&difficulty=${query.difficulty}&type=${query.answerType}`;
    const res = await QUIZAXIOS.get(reqString);
    const dataRes = await res.data;
    return dataRes;
  } catch (error) {
    console.error(error.message);
    return error;
  }
};

export { getUsers, getCategories, createQuizOpenTDBRequest };
