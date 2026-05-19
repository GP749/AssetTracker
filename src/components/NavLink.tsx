"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();
  const active =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={`relative rounded-md px-3 py-1.5 text-sm transition-colors ${
        active
          ? "text-white"
          : "text-zinc-400 hover:text-white hover:bg-white/5"
      }`}
    >
      {label}
      {active && (
        <span className="absolute inset-x-2 -bottom-px h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      )}
    </Link>
  );
}
