"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, Icon, Logo } from "./ui";
import { useSession } from "./session";
import { initials } from "@/lib/api";

const nav = [
  { href: "/main", label: "Home", icon: "home" },
  { href: "/main/messages", label: "Messages", icon: "chat" },
  { href: "/main/notifications", label: "Notifications", icon: "bell" },
  { href: "/main/my-mentors", label: "My mentors", icon: "users" },
] as const;

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useSession();
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-surface px-5 py-8 md:flex">
      <Logo href="/main" className="px-2" />

      <p className="mt-12 px-2 text-xs font-medium uppercase tracking-[0.2em] text-subtle">Your space</p>
      <nav className="mt-3 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg border-l-2 px-3 py-3 font-medium ${
                active ? "border-primary bg-surface-muted text-foreground" : "border-transparent text-muted hover:bg-surface-muted"
              }`}
            >
              <Icon name={item.icon} />
              <span className="flex-1">{item.href === "/main/my-mentors" && user.role === "mentor" ? "My mentees" : item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button onClick={logout} className="mt-auto mb-2 rounded-lg px-3 py-2 text-left text-sm text-muted hover:bg-surface-muted">
        Log out
      </button>
      <Link
        href="/main/profile"
        className={` flex items-center gap-3 rounded-lg p-2 hover:bg-surface-muted ${pathname === "/main/profile" ? "bg-surface-muted" : ""}`}
      >
        <Avatar initials={initials(user.full_name)} size="sm" />
        <span className="flex-1">
          <span className="block font-medium">{user.full_name}</span>
          <span className="block text-sm text-subtle">View profile</span>
        </span>
        <Icon name="dots" className="h-5 w-5 text-muted" />
      </Link>
    </aside>
  );
}
