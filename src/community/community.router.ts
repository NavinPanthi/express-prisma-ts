import { Request, Response } from "express";
import express from "express";
import * as CommunityService from "./community.service"; // Import the appropriate service function
export const communityRouter = express.Router();

communityRouter.get("/", async (request: Request, response: Response) => {
  try {
    const { status, data } = await CommunityService.listCommunity();

    if (!status) {
      // If status is false, it means there was an error
      return response.status(500).json({ error: "Internal Server Error" });
    }

    if (!data || data.length === 0) {
      // If data is empty or null, return no matrimonial statuses found
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
});
