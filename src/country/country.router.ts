import express from "express";
import { Request, Response } from "express";

import * as CountryService from "../country/country.service";

export const countryRouter = express.Router();

countryRouter.get("/", async (request: Request, response: Response) => {
  try {
    const { status, data } = await CountryService.listCountry();

    if (!status) {
      // If status is false, it means there was an error
      return response.status(500).json({ error: "Internal Server Error" });
    }

    if (!data || data.length === 0) {
      // If data is empty or null, return no countries found
      return response.status(404).json({ error: "No countries found" });
    }

    // Countries found, return them
    return response.status(200).json({ status, data });
  } catch (error) {
    console.error("Error listing countries", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
});
