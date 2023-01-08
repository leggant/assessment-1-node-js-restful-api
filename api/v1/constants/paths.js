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
    PLAYERUNFINISHEDQUIZZES: `${AUTHONLY}/quiz/incomplete`,
    PLAYERRESULTS: `${AUTHONLY}/quiz/:quizId/player/:userName/results`,
    SUBMITANSWERS: `${AUTHONLY}/quiz/:quizId/player/:userName/submit_answers`,
  },
};

export default PATHS;
