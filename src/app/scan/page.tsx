import { Scanner } from "@/components/Scanner";

export const metadata = { title: "Scan — Asset Tracker" };

export default function ScanPage() {
  return (
    <div className="mx-auto max-w-md space-y-5">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-blue-400">
          scan.qr
        </div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Scan a tool
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Allow camera access, then point at a printed tool label.
        </p>
      </div>
      <Scanner />
    </div>
  );
}
