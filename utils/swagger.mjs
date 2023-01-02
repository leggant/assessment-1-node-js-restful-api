import swaggerJSDoc from "swagger-jsdoc";
import APICONFIG from "../api/v1/constants/config.js";

const swaggerDefinition = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express API for Quizzers",
      version: "1.0.0",
      desciption:
        "A Quiz API for Admins and Players, built using expressjs, postgres and prisma",
      license: {
        name: "Licensed Under MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "JSONPlaceholder",
        url: "https://jsonplaceholder.typicode.com",
      },
    },
    servers: [
      {
        url: `http://localhost:3000/${APICONFIG.basePath}/${APICONFIG.version}`,
        description: "Local Dev Server",
      },
      {
        url: `https://localhost:3000/${APICONFIG.basePath}/${APICONFIG.version}`,
        description: "Heroku Staging Server",
      },
      {
        url: `https://localhost:3000/${APICONFIG.basePath}/${APICONFIG.version}`,
        description: "Heroku Production Server",
      },
    ],
  },
  apis: ["./api/v1/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerDefinition);
const swaggerEndPoint = "api-docs";

export { swaggerSpec, swaggerEndPoint };
