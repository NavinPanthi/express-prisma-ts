import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { authorRouter } from "./author/author.router";

dotenv.config();
//load environment variables from a .env file into process.env.
if (!process.env.PORT) {
  process.exit(1);
}
const PORT: number = parseInt(process.env.PORT as string, 10);
// here 10 indicates base 10 (decimal), so the string is parsed as a decimal number.

const app = express();
app.use(cors());
// This line adds the CORS (Cross-Origin Resource Sharing) middleware to your Express application.
app.use(express.json());
// parse incoming requests with JSON payloads.

app.use("/api/authors", authorRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
