import express from "express";
import { Request, Response } from "express";

import * as ReligionService from "../religion/religion.service";

export const religionRouter = express.Router();

religionRouter.get("/", async (request: Request, response: Response) => {
  try {
    const { status, data } = await ReligionService.listReligion();

    if (!status) {
      // If status is false, it means there was an error
      return response.status(500).json({ error: "Internal Server Error" });
    }

    if (!data || data.length === 0) {
      // If data is empty or null, return no religions found
      return response.status(404).json({ error: "No religions found" });
    }

    // Religions found, return them
    return response.status(200).json({ status, data });
  } catch (error) {
    console.error("Error listing religions", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
});
