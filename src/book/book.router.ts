// // 200 OK
// //201 CREATED
// //404 NOT FOUND
// //400 BAD REQUEST
// //500 INTERNAL SERVER ERROR
// import { db } from "../utils/db.server";

// import express from "express";
// import { Request, Response } from "express";
// // import { body, validationResult } from "express";
// const verifyToken = require("../middleware/verifyToken");

// import * as BookService from "../book/book.service";
// import { body, validationResult } from "express-validator";

// export const bookRouter = express.Router();

// // GET : list of all books
// //Using verifyToken middleware to  ensure that only logged in users can access this route
// bookRouter.get("/", verifyToken, async (request: any, response: Response) => {
//   try {
//     const books = await BookService.listBooks();
//     console.log(request.user.id); //this is the id of the logged in user received from the middleware.
//     if (!books || books.length === 0) {
//       return response.status(400).json({ error: "No books found" });
//     }
//     return response.status(200).json(books);
//   } catch (error: any) {
//     console.error("Error listing books", error);
//     return response.status(500).json(error.message);
//   }
// });
// // GET : a book
// bookRouter.get("/:id", async (request: Request, response: Response) => {
//   const id: number = parseInt(request.params.id, 10);
//   try {
//     const book = await BookService.getBook(id);
//     if (!book) {
//       return response
//         .status(404)
//         .json({ error: `Book with the id ${id} not found ` });
//     }
//     return response.status(200).json(book);
//   } catch (error: any) {
//     return response.status(500).json(error.message);
//   }
// });
// // POST : create a new book
// bookRouter.post(
//   "/",
//   body("title").isString().notEmpty(),
//   body("isFiction").isBoolean(),
//   body("datePublished").isDate().toDate(),
//   body("authorId").isInt(),
//   async (request: Request, response: Response) => {
//     const errors = validationResult(request);
//     if (!errors.isEmpty()) {
//       return response.status(400).json({ errors: "Invalid request body" });
//     }
//     try {
//       const book = request.body;
//       const newBook = await BookService.createBook(book);
//       return response.status(201).json(newBook);
//     } catch (error: any) {
//       return response.status(500).json(error.message);
//     }
//   }
// );

// // PUT : Update a book
// bookRouter.put(
//   "/:id",
//   body("title").isString().notEmpty(),
//   body("isFiction").isBoolean(),
//   body("datePublished").isDate().toDate(),
//   body("authorId").isInt(),
//   async (request: Request, response: Response) => {
//     const errors = validationResult(request);
//     const id: number = parseInt(request.params.id, 10);
//     const authorId: number = request.body.authorId;
//     if (isNaN(id) || id <= 0) {
//       return response.status(400).json({
//         error: "Invalid id parameter. Please provide a valid positive integer.",
//       });
//     } else if (!errors.isEmpty()) {
//       return response.status(400).json({ error: "Invalid request body" });
//     }
//     const existingAuthor = await db.author.findUnique({
//       where: {
//         id: authorId,
//       },
//     });
//     if (!existingAuthor) {
//       return response
//         .status(404)
//         .json({ error: `Author with the id ${authorId} not found` });
//     }
//     try {
//       const existingBook = await db.book.findUnique({
//         where: {
//           id: id,
//         },
//       });
//       if (!existingBook) {
//         return response
//           .status(404)
//           .json({ error: `Book with the id ${id} not found` });
//       }
//       const updatedBook = await BookService.updateBook(request.body, id);
//       return response.status(200).json(updatedBook);
//     } catch (error: any) {
//       return response.status(500).json(error.message);
//     }
//   }
// );

// // delete a book
// bookRouter.delete("/:id", async (request: Request, response: Response) => {
//   const id: number = parseInt(request.params.id, 10);
//   try {
//     await BookService.deleteBook(id);
//     return response
//       .status(204)
//       .json(`Book with id ${id} deleted successfully.`);
//   } catch (error: any) {
//     return response.status(500).json(error.message);
//   }
// });
