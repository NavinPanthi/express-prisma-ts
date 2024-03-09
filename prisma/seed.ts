import { db } from "../src/utils/db.server";

type Author = {
  firstName: string;
  lastName: string;
};

type Book = { title: string; isFiction: boolean; datePublished: Date };

async function seed() {
  await Promise.all(
    getAuthors().map((author) => {
      return db.author.create({
        data: {
          firstName: author.firstName,
          lastName: author.lastName,
        },
      });
    })
  );
  const author = await db.author.findFirst({
    where: { firstName: "Johny" },
  });
  if (author) {
    await Promise.all(
      getBooks().map((book) => {
        const { title, isFiction, datePublished } = book;
        return db.book.create({
          data: {
            title,
            isFiction,
            datePublished,
            authorId: author.id,
          },
        });
      })
    );
  } else {
    console.error("Author not found!"); // Handle the case when author is not found
  }
}
seed();

function getAuthors(): Array<Author> {
  return [
    { firstName: "John", lastName: "Doe" },
    { firstName: "Johny", lastName: "Lever" },
    { firstName: "Navin", lastName: "Panthi" },
  ];
}

function getBooks(): Array<Book> {
  return [
    { title: "Social", isFiction: false, datePublished: new Date() },
    { title: "Science", isFiction: false, datePublished: new Date() },
    { title: "English", isFiction: true, datePublished: new Date() },
  ];
}
