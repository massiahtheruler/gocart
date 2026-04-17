import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set.");
}

// This repo uses Prisma's Neon adapter directly instead of the older
// `@neondatabase/serverless` + `ws` runtime wiring shown in some tutorials.
// Keep that manual setup out unless we hit a real runtime need for it.
const adapter = new PrismaNeon({
  connectionString,
});

const prisma = globalThis.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export default prisma;
