const AUTHONLY = "/user/auth";
const PATHS = {
  REGISTER: `${AUTHONLY}/register`,
  LOGIN: `${AUTHONLY}/login`,
  ADMIN: {
    SEEDER: `${AUTHONLY}/admin/seeder`,
    QUIZ: `${AUTHONLY}/admin/quiz`,
    QUIZQUERY: `${AUTHONLY}/admin/quiz/:quizId`,
    QUIZPLAYER: `${AUTHONLY}/admin/quiz/:quizId/player/:playerId`,
    USERSEARCH: `${AUTHONLY}/admin/details/:searchField/:searchValue`,
  },
  USER: {
    PROFILE: `${AUTHONLY}/profile`,
  },
  QUIZ: {
    PLAYER: `${AUTHONLY}/quiz`,
    PLAYERQUERY: `${AUTHONLY}/quiz/:quizId`,
    PLAYERRESULTS: `${AUTHONLY}/quiz/:quizId/player/:playerId`,
    PLAYERTOTAL: `${AUTHONLY}/details/:userId/results`,
  },
};

export default PATHS;
