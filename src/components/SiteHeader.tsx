import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { MemberPicker } from "./MemberPicker";
import { NavLink } from "./NavLink";

const links: { href: string; label: string }[] = [
  { href: "/", label: "Tools" },
  { href: "/insights", label: "Insights" },
  { href: "/scan", label: "Scan" },
  { href: "/tools/new", label: "Add" },
  { href: "/members", label: "Team" },
];

export async function SiteHeader() {
  const [members, jar] = await Promise.all([
    prisma.member.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    cookies(),
  ]);
  const initial = jar.get("memberId")?.value ?? "";

  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-[#08080a]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex flex-wrap items-center gap-5">
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-sm font-semibold tracking-tight text-zinc-100"
          >
            <span className="relative grid h-6 w-6 place-items-center rounded-md bg-blue-500/15 ring-1 ring-blue-500/40">
              <span className="h-1.5 w-1.5 rounded-sm bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            </span>
            <span>
              Asset<span className="text-blue-400">·</span>Tracker
            </span>
          </Link>
          <nav className="flex flex-wrap gap-0.5">
            {links.map((l) => (
              <NavLink key={l.href} href={l.href} label={l.label} />
            ))}
          </nav>
        </div>
        <MemberPicker members={members} initial={initial} />
      </div>
    </header>
  );
}
