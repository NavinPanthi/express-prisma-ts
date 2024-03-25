import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { authorRouter } from "./author/author.router";
import { bookRouter } from "./book/book.router";
import { userRouter } from "./user/user.router";

require("dotenv").config();
//load environment variables from a .env file intso process.env.
if (!process.env.PORT2) {
  process.exit(1);
}
const PORT2: number = parseInt(process.env.PORT2 as string, 10);
// here 10 indicates base 10 (decimal), so the string is parsed as a decimal number.

const app = express();
app.use(cors());
// This line adds the CORS (Cross-Origin Resource Sharing) middleware to your Express application.
app.use(express.json());
// parse incoming requests with JSON payloads.

app.use("/api/authors", authorRouter);
app.use("/api/books", bookRouter);
app.use("/api/users", userRouter);

app.listen(PORT2, () => {
  console.log(`Listening on port ${PORT2}`);
});
