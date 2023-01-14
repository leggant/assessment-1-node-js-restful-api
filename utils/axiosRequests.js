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

const getUsers = async () => {
  const data = await axios
    .all([GISTAXIOS.get(GISTADMIN), GISTAXIOS.get(GISTBASIC)])
    .then(
      axios.spread((admin, basic) => {
        const users = admin.data.concat(basic.data);
        return { users };
      }),
    )
    .catch((err) => {
      console.error(err.message);
    });
  return data;
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
  const data = await QUIZAXIOS.get(CATENDPOINT)
    .then((resData) => {
      const dataRes = resData.data;
      return dataRes.trivia_categories;
    })
    .catch((err) => {
      console.error(err.message);
    });
  return data;
};

// Quiz Admin

const createQuizOpenTDBRequest = async (query) => {
  const reqString = `${CREATEQUIZ}?category=${query.category}&amount=${query.amount}&difficulty=${query.difficulty}&type=${query.answerType}`;
  const data = await QUIZAXIOS.get(reqString)
    .then((resData) => {
      const dataRes = resData.data;
      return dataRes.results;
    })
    .catch((err) => {
      console.error(err.message);
    });
  return data;
};

export { getUsers, getCategories, createQuizOpenTDBRequest };
