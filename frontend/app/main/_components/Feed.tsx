"use client";

import { useState } from "react";
import { Avatar, Icon } from "./ui";
import { Status, useApi, useSession } from "./session";
import { initials, timeAgo, type FeedPost } from "@/lib/api";

// The backend has no posts endpoint yet, so posts made on the home page are stored in this browser.
const LOCAL_KEY = "localPosts";

export function readLocalPosts(): FeedPost[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function addLocalPost(author_name: string, text: string) {
  const post: FeedPost = { id: -Date.now(), author_name, text, created_at: new Date().toISOString(), answer_count: 0 };
  localStorage.setItem(LOCAL_KEY, JSON.stringify([post, ...readLocalPosts()]));
}

// Likes and comments are also stored in this browser until the backend supports them.
type Comment = { id: number; author_name: string; text: string; created_at: string };
type Reactions = { liked: boolean; likes: number; comments: Comment[] };
const REACTIONS_KEY = "postReactions";

function readReactions(): Record<string, Reactions> {
  try {
    return JSON.parse(localStorage.getItem(REACTIONS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export default function Feed() {
  const { data, error, loading } = useApi<FeedPost[]>("/api/questions/");
  const [local] = useState(readLocalPosts);
  // GET /api/questions/ doesn't exist on the backend yet (405) — treat that as no server posts.
  const server = error ? [] : data;
  const posts = server && [...local, ...server].sort((a, b) => b.created_at.localeCompare(a.created_at));
  const [reactions, setReactions] = useState(readReactions);

  function update(id: number, change: (r: Reactions) => Reactions) {
    setReactions((all) => {
      const next = { ...all, [id]: change(all[id] ?? { liked: false, likes: 0, comments: [] }) };
      localStorage.setItem(REACTIONS_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <section className="mt-14">
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-semibold tracking-tight">From your community</h2>
        <p className="text-sm text-muted">Fresh ideas and honest questions</p>
      </div>
      <Status loading={loading} empty={!loading && (posts?.length ?? 0) === 0} emptyText="No posts yet." />
      {posts?.map((p) => (
        <article key={p.id} id={`post-${p.id}`} className="scroll-mt-28 border-b border-border py-8">
          <div className="flex items-start gap-4">
            <Avatar initials={initials(p.author_name)} />
            <div className="flex-1">
              <p className="font-medium">{p.author_name}</p>
              <p className="text-sm text-subtle">{timeAgo(p.created_at)}</p>
            </div>
          </div>
          <div className="pl-[4.5rem]">
            <h3 className="mt-3 text-xl font-semibold leading-snug">{p.text}</h3>
            <PostActions
              post={p}
              reactions={reactions[p.id] ?? { liked: false, likes: 0, comments: [] }}
              onChange={(change) => update(p.id, change)}
            />
          </div>
        </article>
      ))}
    </section>
  );
}

function PostActions({ post, reactions, onChange }: {
  post: FeedPost;
  reactions: Reactions;
  onChange: (change: (r: Reactions) => Reactions) => void;
}) {
  const { user } = useSession();
  const [open, setOpen] = useState(false);
  const { liked, likes, comments } = reactions;
  const commentCount = post.answer_count + comments.length;

  function comment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const text = String(new FormData(form).get("comment") ?? "").trim();
    if (!text) return;
    const c: Comment = { id: Date.now(), author_name: user.full_name, text, created_at: new Date().toISOString() };
    onChange((r) => ({ ...r, comments: [...r.comments, c] }));
    form.reset();
  }

  return (
    <>
      <div className="mt-4 flex items-center gap-6 border-t border-border pt-4 text-sm text-muted">
        <button
          onClick={() => onChange((r) => ({ ...r, liked: !r.liked, likes: r.likes + (r.liked ? -1 : 1) }))}
          aria-pressed={liked}
          className={`flex items-center gap-2 hover:text-foreground ${liked ? "font-medium text-primary" : ""}`}
        >
          <Icon name="heart" /> {likes} {likes === 1 ? "like" : "likes"}
        </button>
        <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex items-center gap-2 hover:text-foreground">
          <Icon name="chat" /> {commentCount} {commentCount === 1 ? "comment" : "comments"}
        </button>
      </div>

      {open && (
        <div className="mt-4 space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <Avatar initials={initials(c.author_name)} size="sm" />
              <div className="flex-1 rounded-lg bg-surface-muted p-3 text-sm">
                <p className="font-medium">
                  {c.author_name} <span className="text-xs font-normal text-subtle">· {timeAgo(c.created_at)}</span>
                </p>
                <p className="mt-1 leading-6">{c.text}</p>
              </div>
            </div>
          ))}
          <form onSubmit={comment} className="flex gap-3">
            <input
              name="comment"
              required
              autoFocus
              placeholder="Write a comment…"
              className="flex-1 rounded border border-border-strong bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <button className="rounded bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover">Comment</button>
          </form>
        </div>
      )}
    </>
  );
}
