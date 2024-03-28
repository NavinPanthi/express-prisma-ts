// 200 OK
//201 CREATED
//404 NOT FOUND
//400 BAD REQUEST
//500 INTERNAL SERVER ERROR
// import { db } from "../utils/db.server";

import express from "express";
import { Request, Response } from "express";
import * as dotenv from "dotenv";

dotenv.config(); //load environment variables from a .env file into process.env.
const jwt = require("jsonwebtoken");
import * as UserService from "../user/user.service";
import { body, validationResult } from "express-validator";
import { request } from "http";

export const userRouter = express.Router();
const bcrypt = require("bcrypt");
let refreshTokens: any = [];

// GET : list of all users
userRouter.get("/", async (request: Request, response: Response) => {
  try {
    const users = await UserService.listUsers();
    if (users.length === 0) {
      return response.status(400).json({ error: "No users found" });
    }
    return response.status(200).json(users);
  } catch (error: any) {
    console.error("Error listing users", error);
    return response.status(500).json(error.message);
  }
});

// GET : list of one user with matching id
userRouter.get("/:id", async (request: Request, response: Response) => {
  const id: number = parseInt(request.params.id, 10);
  try {
    const user = await UserService.getUser(id);
    return response.status(200).json(user);
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});

// POST : create a new user
userRouter.post(
  "/",
  body("email").isEmail().isString().notEmpty(),
  body("firstName").isString().notEmpty(),
  body("lastName").isString().notEmpty(),
  body("password").trim().isString().notEmpty(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    try {
      const user = request.body;
      //   const salt = await bcrypt.genSalt();
      // we can use salt instead of '10' as salt round parameter.
      user.password = await bcrypt.hash(user.password, 10);
      const newUser = await UserService.createUser(user);
      //   console.log(salt, ",", hashedPassword);
      return response.status(201).json(newUser);
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);

//POST : login a user
const generateToken = (userPayLoad: any) => {
  return jwt.sign(userPayLoad, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "20s",
  });
};

userRouter.post(
  "/login",
  body("email").isEmail().isString().notEmpty(),
  body("password").trim().isString().notEmpty(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    try {
      const user = request.body;
      // check if user with unique email extists.
      const userExists = await UserService.loginUser(user);
      if (!userExists) {
        return response.status(404).json({ error: "User not found" });
      }
      //password hashing for authentication.
      const isMatch = await bcrypt.compare(user.password, userExists.password); //compare password using bcrypt
      if (!isMatch) {
        return response.status(401).json({ error: "Invalid credentials" });
      }
      // JWT token authorization
      const userPayLoad = { id: userExists.id };
      const accessToken = generateToken(userPayLoad);
      const refreshToken = jwt.sign(
        userPayLoad,
        process.env.REFRESH_TOKEN_SECRET
      );
      //
      refreshTokens.push(refreshToken);
      const userWithToken = {
        ...userExists,
        accessToken,
        refreshToken,
      };
      return response.status(201).json(userWithToken);
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);
//create a access token using refresh token when access token get expired after 20 seconds
userRouter.post("/token", (request: Request, response: Response) => {
  const refreshToken = request.body.token;
  if (refreshToken == null) return response.status(401).json("No token");
  if (!refreshTokens.includes(refreshToken)) {
    return response.status(403).json("Refresh token is not valid");
  }
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err: any, user: any) => {
      console.log("user", user);
      if (err) return response.sendStatus(403);
      const userPayLoad = { id: user.id };
      const accessToken = generateToken(userPayLoad);
      return response.status(200).json({ accessToken: accessToken });
    }
  );
});
// DELETE : delete all users
userRouter.delete("/", async (request: Request, response: Response) => {
  try {
    await UserService.deleteUsers();
    return response.status(204).send();
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});

//deleting the refresh token which is used to create a new access token.
userRouter.delete("/logout", async (request: Request, response: Response) => {
  const refreshToken = request.body.token;
  refreshTokens = refreshTokens.filter((token: any) => token !== refreshToken);
  return response.sendStatus(204);
});
