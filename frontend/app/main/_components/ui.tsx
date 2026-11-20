import Link from "next/link";

const avatarTones = ["bg-primary/15 text-primary", "bg-secondary/20 text-secondary", "bg-surface-sunken text-foreground"];

export function Avatar({ initials, size = "md" }: { initials: string; size?: "sm" | "md" | "lg" }) {
  const tone = avatarTones[((initials.charCodeAt(0) || 0) + (initials.charCodeAt(1) || 0)) % avatarTones.length];
  const dims = { sm: "h-10 w-10 text-xs", md: "h-14 w-14 text-sm", lg: "h-20 w-20 text-lg" }[size];
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${dims} ${tone}`}>
      {initials}
    </span>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-medium uppercase tracking-wider text-subtle">{children}</p>;
}

export function PageHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-1 text-muted">{subtitle}</p>}
    </div>
  );
}

type IconName = "home" | "chat" | "bell" | "users" | "search" | "plus" | "heart" | "bookmark" | "dots" | "arrowLeft";
const paths: Record<IconName, React.ReactNode> = {
  home: <path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z" />,
  chat: <path d="M4 12a8 8 0 1 1 3.5 6.6L4 20l1.2-3.6A8 8 0 0 1 4 12z" />,
  bell: <path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 21h4" />,
  users: <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M16 3.5a4 4 0 0 1 0 7.5M22 21a7 7 0 0 0-4-6.3" />,
  search: <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  heart: <path d="M12 20s-8-4.6-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.4 12 20 12 20z" />,
  bookmark: <path d="M6 3h12v18l-6-4-6 4z" />,
  arrowLeft: <path d="M19 12H5M11 6l-6 6 6 6" />,
  dots: <path d="M5 12h.01M12 12h.01M19 12h.01" strokeWidth={3} />,
};

export function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {paths[name]}
    </svg>
  );
}

export function EmptyState({ icon, eyebrow = "Your space", title, text }: { icon: IconName; eyebrow?: string; title: string; text: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col justify-center">
      <span className="flex h-20 w-20 items-center justify-center rounded bg-primary text-foreground">
        <Icon name={icon} className="h-9 w-9" />
      </span>
      <div className="mt-8"><Eyebrow>{eyebrow}</Eyebrow></div>
      <h1 className="mt-2 text-5xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-6 text-lg text-muted">{text}</p>
      <Link href="/main" className="mt-8 flex w-fit items-center gap-3 rounded bg-foreground px-6 py-4 font-medium text-background hover:opacity-90">
        <Icon name="arrowLeft" /> Back to the community
      </Link>
    </div>
  );
}

export function Logo({ href = "/", className = "" }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={`flex items-center gap-2 text-xl font-semibold tracking-tight ${className}`}>
      <span className="relative h-7 w-7">
        <span className="absolute left-0 top-0 h-4 w-4 rounded-full bg-secondary" />
        <span className="absolute right-0 top-0 h-4 w-4 rounded-full bg-primary" />
        <span className="absolute bottom-0 left-1.5 h-4 w-4 rounded-full bg-border-strong" />
      </span>
      connect<span className="text-primary">HER</span>
    </Link>
  );
}
