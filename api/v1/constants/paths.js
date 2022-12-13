const PATHS = {
  AUTH: "user/auth",
  REGISTER: "/register",
  LOGIN: "/login",
  ADMIN: {
    METHODS: ["GET", "CREATE", "UPDATE", "DELETE"],
    ADMINSEEDER: "user/auth/admin/seeder",
    ADMINQUIZ: "user/auth/admin/quiz",
  },
  BASIC: {
    METHODS: ["GET", "CREATE"],
    USERQUIZ: "user/auth/quiz",
  },
};

export default PATHS;
