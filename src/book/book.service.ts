import { db } from "../utils/db.server";
import { Author } from "../author/author.service";

interface Book {
  id: number;
  title: string;
  isFiction: boolean;
  datePublished: Date;
}

interface BookRead extends Book {
  author: Author;
}
interface BookWrite extends Book {
  authorId: number;
}

export const listBooks = async (): Promise<BookRead[]> => {
  return db.book.findMany({
    select: {
      id: true,
      title: true,
      isFiction: true,
      datePublished: true,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export const getBook = async (id: number): Promise<BookRead | null> => {
  return db.book.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      isFiction: true,
      datePublished: true,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export const createBook = async (
  book: Omit<BookWrite, "id">
): Promise<BookRead> => {
  const { title, isFiction, datePublished, authorId } = book;
  const parsedDate: Date = new Date(datePublished);
  return db.book.create({
    data: {
      title,
      isFiction,
      datePublished: parsedDate,
      authorId,
    },
    select: {
      id: true,
      title: true,
      isFiction: true,
      datePublished: true,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};
export const updateBook = async (
  book: Omit<BookWrite, "id">,
  id: number
): Promise<BookRead> => {
  const { title, isFiction, datePublished, authorId } = book;
  const parsedDate: Date = new Date(datePublished);
  return db.book.update({
    where: {
      id,
    },
    data: {
      title,
      isFiction,
      datePublished: parsedDate,
      authorId,
    },
    select: {
      id: true,
      title: true,
      isFiction: true,
      datePublished: true,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};
export const deleteBook = async (id: number): Promise<void> => {
  await db.book.delete({
    where: {
      id,
    },
  });
};
