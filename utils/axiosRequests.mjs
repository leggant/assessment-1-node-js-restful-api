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
    "https://gist.githubusercontent.com/leggant/0bba24ff5402123c0a1301df853c5541/raw/1749009d0d9ef6d14dd67939d6d5b734a2621c0c",
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

export { QUIZAXIOS, getUsers, getCategories };
