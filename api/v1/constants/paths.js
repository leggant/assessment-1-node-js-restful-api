const AUTHONLY = "/user/auth";

/**
 * API endpoints set as constants which are used throughout the API
 * each end point is relative to the environment in which it is used
 * @const {Object} PATHS
 * @example "localhost:3000/api/v1/user/auth/profile" (local - uses the staging app server)
 * "https://in-dev-app.herokuapp.com/api/v1/user/auth/quiz/:quizId" (staging),
 * "https://api-prod-app.herokuapp.com/api/v1/user/auth/admin/quiz/:quizId"(production)
 */
const PATHS = {
  BASE: `/api/${process.env.API_VERSION}`,
  REGISTER: `${AUTHONLY}/register`,
  LOGIN: `${AUTHONLY}/login`,
  ADMIN: {
    PLAYERSEEDER: `${AUTHONLY}/admin/seeder/players`,
    CATEGORYSEEDER: `${AUTHONLY}/admin/seeder/categories`,
    QUIZ: `${AUTHONLY}/admin/quiz`,
    QUIZQUERY: `${AUTHONLY}/admin/quiz/:quizId`,
    QUIZQUERYTEST: `${AUTHONLY}/admin/quiz/`,
    USERSEARCH: `${AUTHONLY}/admin/details/:searchField/:searchValue`,
    USERSEARCHTEST: `${AUTHONLY}/admin/details/`,
  },
  USER: {
    PROFILE: `${AUTHONLY}/profile`,
  },
  QUIZ: {
    PLAYER: `${AUTHONLY}/quiz/:quizId`,
    PLAYERTEST: `${AUTHONLY}/quiz/`,
    QUESTIONS: `${AUTHONLY}/quiz/:quizId/questions`,
    PLAYERRESULTS: `${AUTHONLY}/quiz/results/:query`,
    SUBMITANSWERS: `${AUTHONLY}/quiz/:quizId/submit`,
  },
};

/**
 * @exports PATHS
 */
export default PATHS;
