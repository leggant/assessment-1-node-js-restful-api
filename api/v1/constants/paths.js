const PATHS = {
  AUTH: "user/auth",
  REGISTER: "/register",
  LOGIN: "/login",
  ADMIN: {
    ADMINSEEDER: "/user/auth/admin/seeder",
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
