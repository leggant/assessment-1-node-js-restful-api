const PATHS = {
  AUTH: "user/auth",
  REGISTER: "/register",
  LOGIN: "/login",
  ADMIN: {
    ADMINSEEDER: "/user/auth/admin/seeder",
  },
  USERDETAILS: {
    USER: "/details",
    ADMINUSERNAME: "/quizadmin/details/:userName",
    ADMINUSEREMAIL: "/quizadmin/details/:email",
  },
  QUIZ: {
    USERQUIZ: "/quiz",
    ADMINQUIZ: "/admin/quiz",
  },
};

export default PATHS;
