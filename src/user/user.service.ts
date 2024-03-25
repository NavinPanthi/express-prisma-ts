import { db } from "../utils/db.server";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

type UserLogin = {
  email: string;
  password: string;
};
export const listUsers = async (): Promise<User[]> => {
  return db.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      password: true,
    },
  });
};

export const getUser = async (id: number): Promise<User | null> => {
  return db.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      password: true,
    },
  });
};

export const createUser = async (user: Omit<User, "id">): Promise<User> => {
  const { email, firstName, lastName, password } = user;

  return db.user.create({
    data: {
      email,
      firstName,
      lastName,
      password,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      password: true,
    },
  });
};

export const loginUser = async (user: UserLogin): Promise<User | null> => {
  //   const { email, firstName, lastName, password } = user;
  const { email, password } = user;
  return db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      password: true,
    },
  });
};

// service for deleting users
export const deleteUsers = async (): Promise<void> => {
  await db.user.deleteMany({});
};
