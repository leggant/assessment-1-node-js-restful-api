import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

import PATHS from "./api/v1/constants/paths.js";

import loginRegisterRoutes from "./api/v1/routes/auth.js";
import userProfileRoutes from "./api/v1/routes/userProfileAdmin.js";
import userSeederRouter from "./api/v1/routes/userSeeder.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const BASE_URL = "api";
/**
 * The current version of this API is 1
 */
const CURRENT_VERSION = process.env.API_VERSION || "v1";

/**
 * The default port in the development env is 3000
 */
const PORT = process.env.PORT;

app.get(`/${BASE_URL}/${CURRENT_VERSION}`, (req, res) => {
  res.json({ msg: `/${BASE_URL}/${CURRENT_VERSION}` });
});

app.use(`/${BASE_URL}/${CURRENT_VERSION}/${PATHS.AUTH}`, loginRegisterRoutes);
app.use(`/${BASE_URL}/${CURRENT_VERSION}/${PATHS.AUTH}`, userProfileRoutes);
/**
 * Seeder Path
 * user/auth/admin/data/seeder
 */
app.use(`/${BASE_URL}/${CURRENT_VERSION}/${PATHS.AUTH}`, userSeederRouter);
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

export default app;
