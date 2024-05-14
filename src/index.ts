import * as dotenv from "dotenv";
import express, { Request, Response, NextFunction, Express } from "express";
import cors from "cors";

// import { authorRouter } from "./author/author.router";
// import { bookRouter } from "./book/book.router";
import { userRouter } from "./user/user.router";
import { matrimonialStatusRouter } from "./maritalStatus/maritalStatus.router";
import { countryRouter } from "./country/country.router";
import { communityRouter } from "./community/community.router";
import { religionRouter } from "./religion/religion.router";
import { motherTongueRouter } from "./motherTongue/motherTongue.router";
import { cityRouter } from "./city/city.router";

dotenv.config();

if (!process.env.PORT) {
  console.error("Port not specified in environment variables.");
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app: Express = express();
app.use(cors());
app.use(express.json());

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

//Routes

app.use("/api/users", userRouter);
app.use("/api/matrimonial-status", matrimonialStatusRouter);
app.use("/api/country", countryRouter);
app.use("/api/city", cityRouter);
app.use("/api/religion", religionRouter);
app.use("/api/mother-tongue", motherTongueRouter);
app.use("/api/community", communityRouter);

// Throw error if server is not running
server.on("error", (err) => {
  console.error("Server failed to start:", err);
  process.exit(1);
});
