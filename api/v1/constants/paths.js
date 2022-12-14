const PATHS = {
  AUTH: "user/auth",
  REGISTER: "/register",
  LOGIN: "/login",
  ADMIN: {
    METHODS: ["GET", "CREATE", "UPDATE", "DELETE"],
    ADMINSEEDER: "/user/auth/admin/seeder",
  },
  BASIC: {
    METHODS: ["GET", "CREATE"],
  },
  USER: {
    USERDETAILS: "/details",
  },
  QUIZ: {
    USERQUIZ: "/quiz",
    ADMINQUIZ: "/admin/quiz",
  },
};

export default PATHS;
