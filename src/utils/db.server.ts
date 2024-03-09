import { PrismaClient } from "@prisma/client";

let db: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}
if (!global._db) {
  global._db = new PrismaClient();
}

db = global._db;

export { db };  
