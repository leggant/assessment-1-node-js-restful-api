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
  USERDETAILS: {
    USERNAME: "/details/:userName",
    USEREMAIL: "/details/:email",
    USER: "/details",
  },
  QUIZ: {
    USERQUIZ: "/quiz",
    ADMINQUIZ: "/admin/quiz",
  },
};

export default PATHS;
