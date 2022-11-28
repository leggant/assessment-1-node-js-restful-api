import express, { urlencoded, json } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

dotenv.config();

const app = express();

const BASE_URL = "api";

/**
 * The current version of this API is 1
 */
const CURRENT_VERSION = "v1";

const PORT = process.env.PORT;

app.use(cors());
app.use(helmet());
app.use(urlencoded({ extended: false }));
app.use(json());

app.get(`/${BASE_URL}/${CURRENT_VERSION}`, (req, res) => {
  res.json({ msg: `/${BASE_URL}/${CURRENT_VERSION}` });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

export default app;
