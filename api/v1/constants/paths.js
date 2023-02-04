const AUTHONLY = "/user/auth";
const PATHS = {
  BASE: `/api/${process.env.API_VERSION}`,
  REGISTER: `${AUTHONLY}/register`,
  LOGIN: `${AUTHONLY}/login`,
  ADMIN: {
    PLAYERSEEDER: `${AUTHONLY}/admin/seeder/players`,
    CATEGORYSEEDER: `${AUTHONLY}/admin/seeder/categories`,
    QUIZ: `${AUTHONLY}/admin/quiz`,
    QUIZQUERY: `${AUTHONLY}/admin/quiz/:quizId`,
    USERSEARCH: `${AUTHONLY}/admin/details/:searchField/:searchValue`,
    USERSEARCHTEST: `${AUTHONLY}/admin/details/`,
  },
  USER: {
    PROFILE: `${AUTHONLY}/profile`,
  },
  QUIZ: {
    PLAYER: `${AUTHONLY}/quiz/:quizId`,
    QUESTIONS: `${AUTHONLY}/quiz/:quizId/questions`,
    PLAYERRESULTS: `${AUTHONLY}/quiz/results/:query`,
    SUBMITANSWERS: `${AUTHONLY}/quiz/:quizId/submit`,
  },
};

export default PATHS;
