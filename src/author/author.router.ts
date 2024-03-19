import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { db } from "../utils/db.server";

import * as AuthorService from "./author.service";

export const authorRouter = express.Router();
// 200 OK
//201 CREATED
//404 NOT FOUND
//400 BAD REQUEST
//500 INTERNAL SERVER ERROR

//GET : List of all authors
authorRouter.get("/", async (request: Request, response: Response) => {
  try {
    const authors = await AuthorService.listAuthors();
    return response.status(200).json(authors);
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});

//GET : List of one author with matching id
authorRouter.get("/:id", async (request: Request, response: Response) => {
  const id: number = parseInt(request.params.id, 10);
  try {
    const author = await AuthorService.getAuthor(id);
    if (author) {
      return response.status(200).json(author);
    }
    return response.status(404).json("Author could not be found");
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});

// Create a author
authorRouter.post(
  "/",
  body("firstName").isString(),
  body("lastName").isString(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    try {
      const author = request.body;
      const newAuthor = await AuthorService.createAuthor(author);
      return response.status(201).json(newAuthor);
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);
// Update a author
authorRouter.put(
  "/:id",
  body("firstName").isString(),
  body("lastName").isString(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);

    const id: number = parseInt(request.params.id, 10);

    if (isNaN(id) || id <= 0) {
      // isNaN return true if id is a not a number.
      return response.status(400).json({
        error: "Invalid id parameter. Please provide a valid positive integer.",
      });
    } else if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    try {
      // Check if the author with the provided ID exists
      const existingAuthor = await db.author.findUnique({
        where: {
          id: id,
        },
      });

      if (!existingAuthor) {
        return response
          .status(404)
          .json({ error: `Author with the id ${id}  not found.` });
      }
      const author = request.body;
      const updatedAuthor = await AuthorService.updateAuthor(author, id);
      return response.status(200).json(updatedAuthor);
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);

// delete a author
authorRouter.delete("/:id", async (request: Request, response: Response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(500).json({ errors: errors.array() });
  }
  const id: number = parseInt(request.params.id, 10);
  try {
    await AuthorService.deleteAuthor(id);
    return response
      .status(204)
      .json(`Author with id ${id} deleted successfully.`);
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});
