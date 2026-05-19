import { prisma } from "@/lib/db";
import { csvFilename, toCSV } from "@/lib/csv";

export async function GET() {
  const checkouts = await prisma.checkout.findMany({
    orderBy: { checkedOutAt: "desc" },
    include: {
      tool: { select: { name: true, category: true } },
      member: { select: { name: true } },
    },
  });

  const rows = checkouts.map((c) => ({
    id: c.id,
    toolId: c.toolId,
    toolName: c.tool.name,
    toolCategory: c.tool.category,
    memberId: c.memberId,
    memberName: c.member.name,
    checkedOutAt: c.checkedOutAt,
    returnedAt: c.returnedAt,
    checkoutNote: c.checkoutNote,
    returnNote: c.returnNote,
    returnCondition: c.returnCondition,
    damageReported: c.damageReported,
  }));

  const csv = toCSV(rows, [
    { key: "id", header: "id" },
    { key: "toolId", header: "toolId" },
    { key: "toolName", header: "toolName" },
    { key: "toolCategory", header: "toolCategory" },
    { key: "memberId", header: "memberId" },
    { key: "memberName", header: "memberName" },
    { key: "checkedOutAt", header: "checkedOutAt" },
    { key: "returnedAt", header: "returnedAt" },
    { key: "checkoutNote", header: "checkoutNote" },
    { key: "returnNote", header: "returnNote" },
    { key: "returnCondition", header: "returnCondition" },
    { key: "damageReported", header: "damageReported" },
  ]);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${csvFilename("checkouts")}"`,
      "Cache-Control": "no-store",
    },
  });
}
