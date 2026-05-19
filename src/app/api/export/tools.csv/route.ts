import { prisma } from "@/lib/db";
import { csvFilename, toCSV } from "@/lib/csv";

export async function GET() {
  const tools = await prisma.tool.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  const csv = toCSV(tools, [
    { key: "id", header: "id" },
    { key: "name", header: "name" },
    { key: "category", header: "category" },
    { key: "location", header: "location" },
    { key: "status", header: "status" },
    { key: "description", header: "description" },
    { key: "photoUrl", header: "photoUrl" },
    { key: "maintenanceReason", header: "maintenanceReason" },
    { key: "maintenanceStartedAt", header: "maintenanceStartedAt" },
    { key: "createdAt", header: "createdAt" },
  ]);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${csvFilename("tools")}"`,
      "Cache-Control": "no-store",
    },
  });
}
