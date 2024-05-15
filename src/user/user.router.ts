// 200 OK
//201 CREATED
//404 NOT FOUND
//400 BAD REQUEST
//500 INTERNAL SERVER ERROR
// import { db } from "../utils/db.server";

import express from "express";
import { Request, Response } from "express";
import * as dotenv from "dotenv";
var cors = require("cors");
var multer = require("multer");
dotenv.config(); //load environment variables from a .env file into process.env.
const jwt = require("jsonwebtoken");
import * as UserService from "../user/user.service";
import { body, validationResult } from "express-validator";
const verifyToken = require("../middleware/verifyToken");
import path from "path";
export const userRouter = express.Router();
const bcrypt = require("bcrypt");
let accessTokens: any = [];

const storage = multer.diskStorage({
  destination: (req: Request, file: Response, cb: any) => {
    cb(null, "public/images");
  },
  filename: (req: Request, file: any, cb: any) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
});

// GET : list of all users
userRouter.get("/", async (response: Response) => {
  try {
    const datas = await UserService.listUsers();
    const { status, data } = datas;
    if (data.length === 0) {
      return response.status(400).json({ error: "No users found" });
    }
    return response.status(200).json(datas);
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
  body("maritalStatusId").isNumeric().notEmpty(),
  body("gender").isString().notEmpty(),
  body("dateOfBirth").isDate().notEmpty(),
  body("religionId").isNumeric().notEmpty(),
  body("cityId").isNumeric().notEmpty(),
  body("countryId").isNumeric().notEmpty(),
  body("motherTongueId").isNumeric().notEmpty(),
  body("communityId").isNumeric().notEmpty(),
  body("bio"),
  body("image"),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    try {
      const user = request.body;
      user.password = await bcrypt.hash(user.password, 10);
      const newUser = await UserService.createUser(user);
      return response.status(201).json(newUser);
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);

//POST : login a user
const generateToken = (userPayLoad: any) => {
  return jwt.sign(userPayLoad, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};
userRouter.post(
  "/login",
  body("email").isEmail().notEmpty(),
  body("password").trim().isString().notEmpty(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    try {
      const user = request.body;
      const userExists = await UserService.loginUser(user);
      if (!userExists) {
        return response.status(404).json({ error: "User not found" });
      }
      const isMatch = await bcrypt.compare(
        user.password,
        userExists.data?.password
      );

      if (!isMatch && user.password !== userExists.data?.password) {
        return response.status(401).json({ error: "Invalid Credentials" });
      }
      const userPayLoad = { id: userExists.data?.id };
      const accessToken = generateToken(userPayLoad);
      accessTokens.push(accessToken);
      const userWithToken = {
        status: true,
        data: {
          user: userExists.data,
          token: {
            access_token: accessToken,
            token_type: "Bearer",
          },
        },
      };
      return response.status(201).json(userWithToken);
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);

// DELETE : delete all users
userRouter.patch(
  "/change-password",
  verifyToken,
  body("userId").isInt().notEmpty(),
  body("oldPassword").trim().isString().notEmpty(),
  body("newPassword").trim().isString().notEmpty(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    try {
      const { userId, oldPassword, newPassword } = request.body;
      const user = await UserService.getUser(userId);
      if (!user) {
        return response.status(404).json({ error: "User not found" });
      }
      const isMatch = await bcrypt.compare(oldPassword, user.data?.password);
      if (!isMatch && oldPassword !== user.data?.password) {
        return response.status(401).json({
          error:
            "Your current password does not match with the password you provided. Please try again.",
        });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await UserService.updateUser(userId, {
        password: hashedPassword,
      });
      return response
        .status(200)
        .json({ status: true, message: "Password changed successfully" });
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);

userRouter.post(
  "/reset-password",
  body("email").isEmail().isString().notEmpty(),
  body("newPassword").trim().isString().notEmpty(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    try {
      const { email, newPassword } = request.body;
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const message = await UserService.resetPassword(email, hashedPassword);
      return response.status(200).json({ message });
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);
userRouter.patch(
  "/update-profile",
  upload.single("image"),
  verifyToken,
  body("userId").isInt().notEmpty(),
  async (request: Request, response: Response) => {
    const image = request.file?.filename;
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    try {
      const { userId } = request.body;
      const parsedUserId = parseInt(userId, 10); // Convert userId to integer
      const user = await UserService.getUser(userId);
      if (!user) {
        return response.status(404).json({ error: "User not found" });
      }
      const data = await UserService.updateUser(parsedUserId, {
        image,
      });
      console.log(data);
      return response.status(200).json({
        status: true,
        data: image,
        message: "Profile updated successfully",
      });
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);
