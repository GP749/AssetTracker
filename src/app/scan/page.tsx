import { Scanner } from "@/components/Scanner";

export const metadata = { title: "Scan — Asset Tracker" };

export default function ScanPage() {
  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Scan QR code</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Allow camera access, then point your phone at a tool&apos;s printed
        label.
      </p>
      <Scanner />
    </div>
  );
}
