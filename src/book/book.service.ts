import { db } from "../utils/db.server";
import { Author } from "../author/author.service";

interface Book {
  id: number;
  title: string;
  isFiction: boolean;
  datePublished: Date;
}

interface BookRead extends Book {
  author: Author | null;
}
interface BookWrite extends Book {
  authorId: number;
}

export const listBooks = async (): Promise<BookRead[]> => {
  const books = await db.book.findMany({
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

  // Check if books array is empty
  if (books.length === 0) {
    return [];
  }

  // Map over books and ensure author is not undefined
  return books.map((book) => {
    // Ensure book.author is defined before accessing its properties
    const author = book.author
      ? {
          id: book.author.id,
          firstName: book.author.firstName,
          lastName: book.author.lastName,
        }
      : null;

    return {
      id: book.id,
      title: book.title,
      isFiction: book.isFiction,
      datePublished: book.datePublished,
      author: author,
    };
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
