import path from "node:path";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";

const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const filePath = url.startsWith("file:") ? url.slice(5) : url;
const dbPath = path.isAbsolute(filePath)
  ? filePath
  : path.join(process.cwd(), filePath);

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: dbPath }),
});

async function main() {
  console.log("Seeding database…");

  // Wipe in dependency order so re-running the seed is idempotent.
  await prisma.checkout.deleteMany();
  await prisma.tool.deleteMany();
  await prisma.member.deleteMany();

  await prisma.member.createMany({
    data: [{ name: "Alex" }, { name: "Jamie" }, { name: "Kim" }],
  });

  await prisma.tool.createMany({
    data: [
      {
        name: "DeWalt Drill",
        category: "Power Tools",
        description: "20V cordless drill with two batteries.",
      },
      {
        name: "Circular Saw",
        category: "Power Tools",
        description: "7-1/4 inch corded circular saw.",
      },
      {
        name: "Tape Measure (25ft)",
        category: "Hand Tools",
        description: "Stanley FatMax.",
      },
      {
        name: "Stud Finder",
        category: "Hand Tools",
        description: "Magnetic + electronic combo.",
      },
      {
        name: "Step Ladder (6ft)",
        category: "Access Equipment",
        description: "Fiberglass, 250 lb rated.",
      },
    ],
  });

  const counts = {
    members: await prisma.member.count(),
    tools: await prisma.tool.count(),
  };
  console.log("Seed complete:", counts);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
