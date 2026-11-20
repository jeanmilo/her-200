import Link from "next/link";
import { Avatar, Eyebrow, Icon, Logo } from "./main/_components/ui";

const menteeSteps = [
  "Sign up and choose Mentee.",
  "Type your question in the “Ask a question” box.",
  "AI picks the top 3 mentors, each with a one-line reason.",
  "Your question reaches them instantly by email and live in-app.",
  "Answers appear live on your dashboard.",
];

const mentorSteps = [
  "Sign up and choose Mentor.",
  "Add your headline, company, fields, topics, short bio and years of experience.",
  "Agree to answer questions about your experience and fields.",
  "Get questions by email and live notification when logged in.",
  "Answer right from your inbox — minutes, not hours.",
];

const exampleMatches = [
  { name: "Priya S.", role: "Senior UX Designer · Self-taught", reason: "Moved into UX from psychology with no design degree." },
  { name: "Maya L.", role: "Product Designer · Bootcamp grad", reason: "Built a portfolio through a bootcamp and freelance work." },
  { name: "Ana R.", role: "UX Research Lead", reason: "Hires junior designers and reviews portfolios regularly." },
];

const impact = [
  { title: "Lower barriers", body: "No network or cold message needed to reach a mentor." },
  { title: "Faster answers", body: "Questions go straight to mentors who've said they're happy to help." },
  { title: "More students in STEM", body: "Support at the moment it matters keeps students on their path." },
  { title: "Minutes, not hours", body: "Mentors spend minutes per question, not hours of back-and-forth." },
];

const initialsOf = (name: string) => name.split(/[\s.]+/).filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const primaryBtn = "flex h-12 items-center justify-center gap-2 rounded bg-foreground px-6 font-medium text-background hover:opacity-90";
const outlineBtn = "flex h-12 items-center justify-center rounded border border-border-strong bg-surface px-6 font-medium hover:bg-surface-muted";

function SectionHeading({ eyebrow, title, center }: { eyebrow: string; title: string; center?: boolean }) {
  return (
    <div className={center ? "text-center" : ""}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
    </div>
  );
}

function Steps({ title, steps, accent, eyebrow }: { title: string; steps: string[]; accent: string; eyebrow: string }) {
  return (
    <div className="rounded border border-border bg-surface p-8">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h3 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h3>
      <ol className="mt-8 space-y-5">
        {steps.map((s, i) => (
          <li key={s} className="flex items-start gap-4 border-b border-border pb-5 last:border-b-0 last:pb-0">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded text-sm font-semibold text-on-primary ${accent}`}>
              {i + 1}
            </span>
            <span className="pt-1.5 text-muted">{s}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background font-sans">
      <header className="sticky top-0 z-10 border-b border-border bg-surface">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <nav className="flex items-center gap-6 text-sm font-medium">
            <a href="#how" className="hidden text-muted hover:text-foreground sm:inline">How it works</a>
            <a href="#impact" className="hidden text-muted hover:text-foreground sm:inline">Impact</a>
            <Link href="/login" className="text-muted hover:text-foreground">Log in</Link>
            <Link href="/signup" className="rounded bg-foreground px-4 py-2.5 text-background hover:opacity-90">Sign up</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-16 px-6 py-24 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Eyebrow>Mentorship without the network</Eyebrow>
            <h1 className="mt-4 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              Ask any career or STEM question. We&apos;ll find who should <span className="text-primary">answer it.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-muted">
              ConnectHER uses AI to route your question to the mentors best placed to answer it.
              They&apos;re notified instantly by email and live in-app — no cold messages required.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup?role=mentee" className={primaryBtn}>
                <Icon name="plus" className="h-5 w-5" /> Ask a question
              </Link>
              <Link href="/signup?role=mentor" className={outlineBtn}>Become a mentor</Link>
            </div>
          </div>

          {/* Example match preview, styled like the in-app cards */}
          <div className="rounded border border-border bg-surface-muted p-7">
            <Eyebrow>Your question</Eyebrow>
            <div className="mt-3 flex items-center gap-4 rounded border border-border bg-surface p-4">
              <Avatar initials="YO" size="sm" />
              <p className="font-medium">How do I break into UX design without a design degree?</p>
            </div>
            <div className="mt-8 flex items-baseline justify-between">
              <Eyebrow>People to know</Eyebrow>
              <span className="text-xs font-medium text-primary">Top 3 matches</span>
            </div>
            <ul className="mt-3 space-y-3">
              {exampleMatches.map((m) => (
                <li key={m.name} className="flex items-center gap-4 rounded border border-border bg-surface p-4">
                  <Avatar initials={initialsOf(m.name)} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{m.name}</p>
                    <p className="text-xs text-muted">{m.role}</p>
                    <p className="mt-1 text-xs font-semibold text-primary">{m.reason}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Problem */}
        <section className="border-y border-border bg-surface-muted py-24">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1fr_1.4fr]">
            <SectionHeading eyebrow="The problem" title="Too many questions go unasked" />
            <div className="space-y-5 text-lg leading-8 text-muted">
              <p>
                First-generation students, women, and students from marginalized communities in STEM
                often don&apos;t have a professional network. They don&apos;t know who to ask, or how to ask —
                and cold outreach is intimidating.
              </p>
              <p>
                With ConnectHER, you ask once. AI finds the right mentors — people who have already said
                they&apos;re happy to answer — and delivers your question to them.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-24">
          <SectionHeading eyebrow="Your space" title="How it works" />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Steps eyebrow="Ask" title="For mentees" steps={menteeSteps} accent="bg-primary" />
            <Steps eyebrow="Answer" title="For mentors" steps={mentorSteps} accent="bg-secondary" />
          </div>
        </section>

        {/* Impact */}
        <section id="impact" className="scroll-mt-20 border-y border-border bg-surface-muted py-24">
          <div className="mx-auto max-w-6xl px-6">
            <SectionHeading eyebrow="Why it matters" title="The impact" />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {impact.map((i, n) => (
                <div key={i.title} className="rounded border border-border bg-surface p-6">
                  <span className={`block h-1 w-10 rounded ${n % 2 ? "bg-secondary" : "bg-primary"}`} />
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">{i.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{i.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="flex flex-col items-start gap-8 rounded border border-border bg-surface p-10 sm:p-14 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Eyebrow>Save your seat</Eyebrow>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Your question deserves an answer</h2>
              <p className="mt-3 text-lg text-muted">
                Join as a mentee to ask, or as a mentor to help the next generation in STEM.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link href="/signup?role=mentee" className={primaryBtn}>Join as a mentee</Link>
              <Link href="/signup?role=mentor" className={outlineBtn}>Join as a mentor</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 text-sm text-subtle">
          <Logo className="text-base" />
          <span>© 2026 ConnectHER</span>
        </div>
      </footer>
    </div>
  );
}
