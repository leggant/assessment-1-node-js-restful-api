const PATHS = {
  AUTH: "user/auth",
  REGISTER: "/register",
  LOGIN: "/login",
  ADMIN: {
    ADMINSEEDER: "/admin/seeder",
  },
  USERDETAILS: {
    USER: "/details",
    ADMINUSERSEARCH: "/quizadmin/details/:searchField/:searchValue",
  },
  QUIZ: {
    USERQUIZ: "/quiz",
    ADMINQUIZ: "/admin/quiz",
  },
};

export default PATHS;
