import path from "node:path";
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { hasUnsplashKey, searchPhoto } from "../src/lib/unsplash";

const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const filePath = url.startsWith("file:") ? url.slice(5) : url;
const dbPath = path.isAbsolute(filePath)
  ? filePath
  : path.join(process.cwd(), filePath);

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: dbPath }),
});

type SeedTool = {
  name: string;
  category: string;
  description: string;
  location: string;
  query: string; // Unsplash search query
};

const MEMBERS = ["Alex", "Jamie", "Kim", "Morgan", "Sam"];

const TOOLS: SeedTool[] = [
  // Power Tools
  {
    name: "DeWalt 20V Cordless Drill",
    category: "Power Tools",
    description: "20V max XR brushless drill, two 5Ah batteries + charger.",
    location: "Cabinet B1",
    query: "cordless drill",
  },
  {
    name: "Makita 7-1/4\" Circular Saw",
    category: "Power Tools",
    description: "Corded, 15A, with carbide blade installed.",
    location: "Cabinet B1",
    query: "circular saw",
  },
  {
    name: "Bosch Reciprocating Saw",
    category: "Power Tools",
    description: "Variable speed, wood and metal blades in the case.",
    location: "Cabinet B2",
    query: "reciprocating saw",
  },
  {
    name: "Milwaukee M18 Impact Driver",
    category: "Power Tools",
    description: "Bit set zipped inside the case.",
    location: "Cabinet B1",
    query: "impact driver tool",
  },
  {
    name: "Ryobi Random Orbital Sander",
    category: "Power Tools",
    description: "5\" pad, dust bag included, assorted grits in the drawer.",
    location: "Cabinet B2",
    query: "orbital sander",
  },

  // Hand Tools
  {
    name: "Stanley FatMax Tape Measure 25ft",
    category: "Hand Tools",
    description: "Wide blade, magnetic hook.",
    location: "Tool wall A",
    query: "tape measure",
  },
  {
    name: "Klein 11-in-1 Screwdriver",
    category: "Hand Tools",
    description: "Multi-bit driver — keep the bits in the handle.",
    location: "Tool wall A",
    query: "screwdriver",
  },
  {
    name: "Estwing 16oz Claw Hammer",
    category: "Hand Tools",
    description: "Steel handle, shock-reduction grip.",
    location: "Tool wall A",
    query: "claw hammer",
  },
  {
    name: "Knipex Pliers Wrench 10\"",
    category: "Hand Tools",
    description: "Smooth-jaw adjustable, won't mar fittings.",
    location: "Tool wall B",
    query: "pliers wrench tool",
  },

  // Measuring
  {
    name: "Franklin ProSensor Stud Finder",
    category: "Measuring",
    description: "Multi-sense, takes 9V battery.",
    location: "Drawer D1",
    query: "stud finder",
  },
  {
    name: "Bosch Laser Distance Measurer",
    category: "Measuring",
    description: "Up to 100ft range, returns calibrated.",
    location: "Drawer D1",
    query: "laser distance measurer",
  },
  {
    name: "Empire 24\" Spirit Level",
    category: "Measuring",
    description: "Aluminum I-beam, three vials.",
    location: "Tool wall B",
    query: "spirit level tool",
  },

  // Access Equipment
  {
    name: "6ft Fiberglass Step Ladder",
    category: "Access Equipment",
    description: "Type IA, 300lb rated.",
    location: "Bay 3",
    query: "step ladder",
  },
  {
    name: "12ft Aluminum Extension Ladder",
    category: "Access Equipment",
    description: "Folds to 6.5ft, two-person lift.",
    location: "Bay 3",
    query: "extension ladder",
  },

  // Safety Gear
  {
    name: "3M Sealed Safety Goggles",
    category: "Safety Gear",
    description: "Anti-fog, fits over prescription glasses.",
    location: "Safety bin",
    query: "safety goggles",
  },
  {
    name: "3M Peltor Hearing Protection",
    category: "Safety Gear",
    description: "Class 5, foldable.",
    location: "Safety bin",
    query: "hearing protection earmuffs",
  },
  {
    name: "Nitrile Work Gloves (XL)",
    category: "Safety Gear",
    description: "Coated palm, mechanic-grade.",
    location: "Safety bin",
    query: "work gloves",
  },

  // Electrical
  {
    name: "Fluke 117 Multimeter",
    category: "Electrical",
    description: "True-RMS, leads in case. Don't lose the case.",
    location: "Drawer D2",
    query: "fluke multimeter",
  },
  {
    name: "Klein Non-Contact Voltage Tester",
    category: "Electrical",
    description: "Pen-style, lights up at 50-1000V AC.",
    location: "Drawer D2",
    query: "voltage tester",
  },
  {
    name: "50ft Heavy-Duty Extension Cord",
    category: "Electrical",
    description: "12 AWG, lighted ends, outdoor-rated.",
    location: "Bay 3",
    query: "extension cord",
  },
];

async function fetchPhotos(): Promise<Map<string, string | null>> {
  const result = new Map<string, string | null>();
  if (!hasUnsplashKey()) {
    console.log(
      "  (no UNSPLASH_ACCESS_KEY — tools will be created without photos)",
    );
    return result;
  }
  console.log(`  Fetching ${TOOLS.length} photos from Unsplash…`);
  // Sequential, polite to the API (free tier = 50 req/hour).
  for (const t of TOOLS) {
    try {
      const url = await searchPhoto(t.query);
      result.set(t.name, url);
      process.stdout.write(url ? "." : "x");
    } catch (e) {
      console.warn(
        `\n  ! ${t.name}: ${e instanceof Error ? e.message : e}`,
      );
      result.set(t.name, null);
    }
  }
  process.stdout.write("\n");
  return result;
}

async function main() {
  console.log("Seeding database…");
  console.log("  Wiping existing rows…");

  await prisma.checkout.deleteMany();
  await prisma.tool.deleteMany();
  await prisma.member.deleteMany();

  console.log(`  Inserting ${MEMBERS.length} members…`);
  await prisma.member.createMany({
    data: MEMBERS.map((name) => ({ name })),
  });

  const photos = await fetchPhotos();

  console.log(`  Inserting ${TOOLS.length} tools…`);
  await prisma.tool.createMany({
    data: TOOLS.map((t) => ({
      name: t.name,
      category: t.category,
      description: t.description,
      location: t.location,
      photoUrl: photos.get(t.name) ?? null,
    })),
  });

  // Seed some prior history so the dashboard isn't all "Available".
  const allTools = await prisma.tool.findMany();
  const allMembers = await prisma.member.findMany();
  if (allTools.length >= 3 && allMembers.length >= 2) {
    const t1 = allTools[0];
    const t2 = allTools[1];
    const t3 = allTools[2];

    // A historical completed checkout
    await prisma.checkout.create({
      data: {
        toolId: t3.id,
        memberId: allMembers[0].id,
        checkedOutAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
        returnedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        checkoutNote: "Bench install",
        returnNote: "All good",
        returnCondition: "good",
      },
    });

    // A current checkout (so dashboard shows amber)
    await prisma.checkout.create({
      data: {
        toolId: t1.id,
        memberId: allMembers[1].id,
        checkedOutAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
        checkoutNote: "Hanging shelving in bay 2",
      },
    });
    await prisma.tool.update({
      where: { id: t1.id },
      data: { status: "CHECKED_OUT" },
    });

    // An overdue checkout (older than typical OVERDUE_DAYS)
    const overdueDays = Number(process.env.OVERDUE_DAYS ?? 14);
    await prisma.checkout.create({
      data: {
        toolId: t2.id,
        memberId: allMembers[0].id,
        checkedOutAt: new Date(
          Date.now() - 1000 * 60 * 60 * 24 * (overdueDays + 3),
        ),
        checkoutNote: "Took home for the weekend",
      },
    });
    await prisma.tool.update({
      where: { id: t2.id },
      data: { status: "CHECKED_OUT" },
    });
  }

  const counts = {
    members: await prisma.member.count(),
    tools: await prisma.tool.count(),
    checkouts: await prisma.checkout.count(),
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
