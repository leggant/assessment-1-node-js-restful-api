const AUTHONLY = "/user/auth";
const PATHS = {
  REGISTER: `${AUTHONLY}/register`,
  LOGIN: `${AUTHONLY}/login`,
  ADMIN: {
    PLAYERSEEDER: `${AUTHONLY}/admin/seeder/players`,
    CATEGORYSEEDER: `${AUTHONLY}/admin/seeder/categories`,
    QUIZ: `${AUTHONLY}/admin/quiz`,
    QUIZQUERY: `${AUTHONLY}/admin/quiz/:quizId`,
    QUIZPLAYER: `${AUTHONLY}/admin/quiz/:quizId/player/:playerId`,
    USERSEARCH: `${AUTHONLY}/admin/details/:searchField/:searchValue`,
  },
  USER: {
    PROFILE: `${AUTHONLY}/profile`,
  },
  QUIZ: {
    PLAYER: `${AUTHONLY}/quiz/:quizId`,
    PLAYERRESULTS: `${AUTHONLY}/quiz/:quizId/results`,
    SUBMITANSWERS: `${AUTHONLY}/quiz/:quizId/submit_answers`,
    PLAYERUNFINISHEDQUIZZES: `${AUTHONLY}/quiz/incomplete`,
  },
};

export default PATHS;
