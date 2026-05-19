import type { ToolStatus } from "@/generated/prisma/enums";

export function statusLabel(status: ToolStatus): string {
  switch (status) {
    case "AVAILABLE":
      return "Available";
    case "CHECKED_OUT":
      return "Checked out";
    case "MAINTENANCE":
      return "Maintenance";
  }
}

const dateFmt = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function formatDateTime(d: Date | string | null | undefined): string {
  if (!d) return "—";
  return dateFmt.format(typeof d === "string" ? new Date(d) : d);
}
