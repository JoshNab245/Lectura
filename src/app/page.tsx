import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getCurrentUser } from "@/lib/auth";

const steps = [
  {
    n: "01",
    title: "Drop the week’s files",
    body: "PowerPoint decks parse in the browser. Lecture audio or seminar video can be transcribed when you add an API key.",
  },
  {
    n: "02",
    title: "Get a study pack, not a transcript dump",
    body: "Summary, outline, flashcards, quiz, and exam tips structured the way a seminar actually examines you.",
  },
  {
    n: "03",
    title: "Revise in the gaps between labs",
    body: "Flip cards on the bus, sit the quiz before the tutorial, export notes into your existing system.",
  },
];

export default async function Home() {
  const user = await getCurrentUser();
  const cta = user ? "/app/new" : "/signup";

  return (
    <>
      <SiteHeader />
      <main>
        <section className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-clay">
              For university students
            </p>
            <h1 className="serif mt-5 max-w-xl text-5xl leading-[1.05] tracking-tight sm:text-6xl">
              Lectures in.
              <br />
              Study-ready out.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-muted">
              Lectura turns PowerPoint and recorded lectures into summaries, flashcards, quizzes,
              and exam notes — so you stop rewatching a two-hour capture the night before the paper.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={cta} className="rounded-full bg-clay px-5 py-3 text-sm font-medium text-white">
                {user ? "Create a study pack" : "Start with 3 free packs"}
              </Link>
              <Link href="/login" className="rounded-full border border-line px-5 py-3 text-sm font-medium">
                Try the demo library
              </Link>
            </div>
            <p className="mt-5 text-sm text-muted">No card needed. Student pricing from £8/month.</p>
          </div>
          <aside className="rounded-[2rem] border border-line bg-card p-6 shadow-[0_30px_80px_-48px_rgba(36,54,82,0.55)]">
            <p className="text-xs uppercase tracking-[0.18em] text-clay">Sample pack</p>
            <h2 className="serif mt-3 text-3xl">Memory systems and encoding</h2>
            <p className="mt-2 text-sm text-muted">PSYC 201 · 12 cards · 5-question quiz</p>
            <dl className="mt-6 space-y-4 text-sm leading-6">
              <div className="rounded-2xl bg-paper p-4">
                <dt className="font-medium">Takeaway</dt>
                <dd className="mt-1 text-muted">
                  Deep elaborative encoding beats rote rehearsal. Retrieval is cue-dependent.
                </dd>
              </div>
              <div className="rounded-2xl bg-navy p-4 text-card">
                <dt className="text-gold">Flashcard</dt>
                <dd className="mt-1">Working memory vs short-term memory?</dd>
              </div>
            </dl>
          </aside>
        </section>

        <section id="how" className="border-y border-line bg-card/60">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-16 md:grid-cols-3">
            {steps.map((step) => (
              <article key={step.n}>
                <p className="text-sm tracking-[0.2em] text-clay">{step.n}</p>
                <h2 className="serif mt-3 text-2xl">{step.title}</h2>
                <p className="mt-3 leading-7 text-muted">{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 py-16">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="serif text-4xl">Made for modules, not meetings.</h2>
              <p className="mt-4 max-w-md leading-7 text-muted">
                Most AI note tools assume a workplace briefing. Lectura assumes a 9am lecture, a
                messy deck, and an exam question that wants compare-and-contrast, not a paragraph of
                vibes.
              </p>
            </div>
            <ul className="space-y-4">
              {[
                ["PowerPoint first", "Slide titles become the skeleton of the study guide."],
                ["Recorded lectures", "Audio and video become a transcript, then a pack, when Whisper is enabled."],
                ["Revision modes", "Flip cards, sit a quiz, export markdown — without another tab jungle."],
              ].map(([title, body]) => (
                <li key={title} className="rounded-2xl border border-line bg-card p-5">
                  <p className="font-medium">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
