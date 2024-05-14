import express from "express";
import { Request, Response } from "express";

import * as CityService from "../city/city.service";

export const cityRouter = express.Router();

cityRouter.get("/", async (request: Request, response: Response) => {
  try {
    const { status, data } = await CityService.listCity();

    if (!status) {
      // If status is false, it means there was an error
      return response.status(500).json({ error: "Internal Server Error" });
    }

    if (!data || data.length === 0) {
      // If data is empty or null, return no cities found
      return response.status(404).json({ error: "No cities found" });
    }

    // Cities found, return them
    return response.status(200).json({ status, data });
  } catch (error) {
    console.error("Error listing cities", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
});
