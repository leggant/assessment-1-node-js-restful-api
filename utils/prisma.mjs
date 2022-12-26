import { PrismaClient } from "@prisma/client";
/**
 * Create a Prisma Client to be imported throughout the app/api.
 * @constructor PrismaClient
 * @constant PRISMA
 * @description initialises a global instance of Prisma Client
 * @example const PRISMA = new PrismaClient();
 * @exports PRISMA export instance of prisma
 */
const PRISMA = new PrismaClient();

export default PRISMA;
