"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Avatar, Icon } from "./ui";
import { useApi, useSession } from "./session";
import { readLocalPosts } from "./Feed";
import { initials, type FeedPost, type InboxItem, type MentorListItem } from "@/lib/api";

type Result = { key: string; kind: "Mentor" | "Mentee" | "Post"; title: string; subtitle: string; href: string };

export default function Search() {
  const router = useRouter();
  const { user } = useSession();
  const isMentor = user.role === "mentor";
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(0);

  // Only fetch once the user starts searching. Mentors search their mentees, mentees search mentors.
  const searching = focused || query !== "";
  const mentors = useApi<MentorListItem[]>(searching && !isMentor ? "/api/mentors/" : null);
  const inbox = useApi<InboxItem[]>(searching && isMentor ? "/api/inbox/" : null);
  const serverPosts = useApi<FeedPost[]>(searching ? "/api/questions/" : null);

  // ⌘K / Ctrl+K focuses the search box.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const matches = (...fields: (string | undefined)[]) => {
    const hay = fields.join(" ").toLowerCase();
    return terms.every((t) => hay.includes(t));
  };

  const people: Result[] = isMentor
    ? [...new Map((inbox.data ?? []).map((i) => [i.mentee_name, i])).values()]
        .filter((i) => matches(i.mentee_name, i.question_text))
        .map((i) => ({ key: `e${i.match_id}`, kind: "Mentee", title: i.mentee_name, subtitle: i.question_text, href: "/main/my-mentors" }))
    : (mentors.data ?? [])
        .filter((m) => matches(m.name, m.headline, m.company, m.fields, m.open_to, m.bio))
        .map((m) => ({
          key: `m${m.mentor_id}`, kind: "Mentor", title: m.name,
          subtitle: [m.headline, m.company, m.fields].filter(Boolean).join(" · "), href: "/main/my-mentors",
        }));

  const posts: Result[] = (focused ? [...readLocalPosts(), ...(serverPosts.error ? [] : serverPosts.data ?? [])] : [])
    .filter((p) => matches(p.text, p.author_name))
    .map((p) => ({ key: `p${p.id}`, kind: "Post", title: p.text, subtitle: p.author_name, href: `/main#post-${p.id}` }));

  const results = terms.length ? [...people.slice(0, 5), ...posts.slice(0, 5)] : [];
  const open = focused && terms.length > 0;

  function go(r: Result) {
    setQuery("");
    input.current?.blur();
    router.push(r.href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter" && results[active]) { e.preventDefault(); go(results[active]); }
    else if (e.key === "Escape") input.current?.blur();
  }

  return (
    <div className="relative max-w-xl flex-1">
      <label className="flex items-center gap-3 rounded border border-border bg-surface px-4 py-3">
        <Icon name="search" className="h-5 w-5 text-subtle" />
        <input
          ref={input}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActive(0); }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={onKeyDown}
          placeholder={isMentor ? "Search mentees or posts" : "Search mentors or posts"}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-subtle"
        />
        <kbd className="rounded border border-border px-1.5 py-0.5 text-xs text-subtle">⌘ K</kbd>
      </label>

      {open && (
        <ul className="absolute left-0 right-0 top-full z-20 mt-2 max-h-96 overflow-y-auto rounded border border-border bg-surface py-2 shadow-lg">
          {results.length === 0 && <li className="px-4 py-3 text-sm text-muted">No results for “{query}”</li>}
          {results.map((r, i) => (
            <li key={r.key}>
              <button
                // mousedown fires before the input's blur, so the click isn't lost
                onMouseDown={(e) => { e.preventDefault(); go(r); }}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full items-center gap-3 px-4 py-2 text-left ${i === active ? "bg-surface-muted" : ""}`}
              >
                <Avatar initials={initials(r.kind === "Post" ? r.subtitle : r.title)} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{r.title}</span>
                  <span className="block truncate text-xs text-muted">{r.subtitle}</span>
                </span>
                <span className="text-xs uppercase tracking-wider text-subtle">{r.kind}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
