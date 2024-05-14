// import { db } from "../utils/db.server";

// export type Author = {
//   id: number;
//   firstName: string;
//   lastName: string;
// };

// //service for listing all authors
// export const listAuthors = async (): Promise<Author[]> => {
//   return db.author.findMany({
//     select: {
//       id: true,
//       firstName: true,
//       lastName: true,
//     },
//   });
// };
// //service for listing a single author based on one id
// export const getAuthor = async (id: number): Promise<Author | null> => {
//   return db.author.findUnique({
//     where: { id },
//     select: {
//       id: true,
//       firstName: true,
//       lastName: true,
//     },
//   });
// };

// // service for creating a new author
// // Omit here means author is of type Author but without id.
// export const createAuthor = async (
//   author: Omit<Author, "id">
// ): Promise<Author> => {
//   const { firstName, lastName } = author;
//   return db.author.create({
//     data: {
//       firstName,
//       lastName,
//     },
//     select: {
//       id: true,
//       firstName: true,
//       lastName: true,
//     },
//   });
// };

// // service for updating an author
// export const updateAuthor = async (
//   author: Omit<Author, "id">,
//   id: number
// ): Promise<Author> => {
//   const { firstName, lastName } = author;
//   return db.author.update({
//     where: {
//       id,
//     },
//     data: {
//       firstName,
//       lastName,
//     },
//     select: {
//       id: true,
//       firstName: true,
//       lastName: true,
//     },
//   });
// };

// // service for get the

// // service for deleting an author
// export const deleteAuthor = async (id: number): Promise<void> => {
//   await db.author.delete({
//     where: {
//       id,
//     },
//   });
// };
