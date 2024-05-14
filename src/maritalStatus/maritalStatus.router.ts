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

import * as UserService from "../maritalStatus/maritalStatus.service";
import { body, validationResult } from "express-validator";

export const matrimonialStatusRouter = express.Router();
const bcrypt = require("bcrypt");
let accessTokens: any = [];

// GET : list of all users
matrimonialStatusRouter.get(
  "/",
  async (request: Request, response: Response) => {
    try {
      const { status, data } = await UserService.listMatrimonialStatus();

      if (!status) {
        // If status is false, it means there was an error
        return response.status(500).json({ error: "Internal Server Error" });
      }

      if (!data || data.length === 0) {
        // If data is empty or null, return no users found
        return response
          .status(404)
          .json({ error: "No matrimonial statuses found" });
      }

      // Matrimonial statuses found, return them
      return response.status(200).json({ status, data });
    } catch (error) {
      console.error("Error listing matrimonial statuses", error);
      return response.status(500).json({ error: "Internal Server Error" });
    }
  }
);
