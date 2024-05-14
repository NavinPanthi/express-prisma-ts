import express from "express";
import { Request, Response } from "express";

import * as MotherTongueService from "../motherTongue/motherTongue.service";

export const motherTongueRouter = express.Router();

motherTongueRouter.get("/", async (request: Request, response: Response) => {
  try {
    const { status, data } = await MotherTongueService.listMotherTongue();

    if (!status) {
      // If status is false, it means there was an error
      return response.status(500).json({ error: "Internal Server Error" });
    }

    if (!data || data.length === 0) {
      // If data is empty or null, return no mother tongues found
      return response.status(404).json({ error: "No mother tongues found" });
    }

    // Mother tongues found, return them
    return response.status(200).json({ status, data });
  } catch (error) {
    console.error("Error listing mother tongues", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
});
