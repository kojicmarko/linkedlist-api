import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import { join } from "path";
import { URL } from "url";
import * as uuid from "uuid";

const generateDatabaseURL = (schema: string) => {
  if (!process.env.DATABASE_URL) {
    throw new Error("Provide a database url");
  }
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.append("schema", schema);
  return url.toString();
};

const id: string = uuid.v4();
const schemaId = `test-${id}`;
const prismaBinary = join(
  __dirname,
  "..",
  "..",
  "node_modules",
  ".bin",
  "prisma"
);

const url = generateDatabaseURL(schemaId);
process.env.DATABASE_URL = url;
export const prisma = new PrismaClient({
  datasources: { db: { url } },
});

// beforeEach
beforeAll(() => {
  execSync(`${prismaBinary} db push --skip-generate`, {
    env: {
      ...process.env,
      DATABASE_URL: generateDatabaseURL(schemaId),
    },
  });
});
// afterEach
afterAll(async () => {
  await prisma.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${schemaId}" CASCADE;`
  );
  await prisma.$disconnect();
});
