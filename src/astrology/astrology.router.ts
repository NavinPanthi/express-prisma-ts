import express from "express";
import { Request, Response } from "express";

import * as AstrologyService from "../astrology/astrology.service"; // Import the AstrologyService

export const astrologyRouter = express.Router(); // Rename the router to astrologyRouter

astrologyRouter.get("/", async (request: Request, response: Response) => {
  try {
    const { status, data } = await AstrologyService.listAstrology(); // Call listAstrology from AstrologyService

    if (!status) {
      return response.status(500).json({ error: "Internal Server Error" });
    }

    if (!data || data.length === 0) {
      return response.status(404).json({ error: "No astrologies found" });
    }

    return response.status(200).json({ status, data });
  } catch (error) {
    console.error("Error listing astrologies", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
});
