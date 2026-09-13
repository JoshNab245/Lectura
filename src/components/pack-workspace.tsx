"use client";

import { useState } from "react";
import { FlashcardDeck } from "@/components/flashcard-deck";
import { QuizPlayer } from "@/components/quiz-player";
import { PLAN_LIMITS } from "@/lib/plans";
import type { Plan, StudyPack } from "@/lib/types";
import { cn } from "@/lib/utils";

const tabs = ["Overview", "Flashcards", "Quiz", "Study guide"] as const;

export function PackWorkspace({
  pack,
  plan,
  cards,
}: {
  pack: StudyPack;
  plan: Plan;
  cards: StudyPack["flashcards"];
}) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview");
  const quizAllowed = PLAN_LIMITS[plan].quiz;
  const ankiAllowed = PLAN_LIMITS[plan].ankiExport;

  function downloadMarkdown() {
    const body = [
      `# ${pack.title}`,
      pack.course ? pack.course : "",
      "",
      pack.summary,
      "",
      "## Key takeaways",
      ...pack.keyTakeaways.map((item) => `- ${item}`),
      "",
      "## Outline",
      ...pack.outline.flatMap((section) => [`### ${section.heading}`, ...section.points.map((point) => `- ${point}`)]),
      "",
      "## Exam tips",
      ...pack.examTips.map((item) => `- ${item}`),
    ].join("\n");
    const blob = new Blob([body], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${pack.title.replace(/[^\w]+/g, "-")}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn(
              "rounded-full px-4 py-2 text-sm",
              tab === item ? "bg-navy text-card" : "border border-line bg-card",
            )}
          >
            {item}
          </button>
        ))}
        <button
          type="button"
          onClick={downloadMarkdown}
          className="rounded-full border border-line px-4 py-2 text-sm"
        >
          Export notes
        </button>
        {ankiAllowed ? (
          <a
            href={`/api/export/${pack.id}/anki`}
            className="rounded-full border border-line px-4 py-2 text-sm"
          >
            Anki CSV
          </a>
        ) : null}
      </div>

      <div className="mt-8">
        {tab === "Overview" ? (
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <section className="rounded-3xl border border-line bg-card p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.18em] text-clay">Summary</p>
              <p className="mt-4 text-lg leading-8">{pack.summary}</p>
              <ul className="mt-6 space-y-3">
                {pack.keyTakeaways.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
            <aside className="space-y-4">
              <section className="rounded-3xl border border-line bg-card p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-clay">Exam tips</p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-muted">
                  {pack.examTips.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section className="rounded-3xl bg-navy p-6 text-card">
                <p className="text-xs uppercase tracking-[0.18em] text-gold">Outline</p>
                <ol className="mt-4 space-y-3 text-sm">
                  {pack.outline.slice(0, 8).map((section) => (
                    <li key={section.heading}>{section.heading}</li>
                  ))}
                </ol>
              </section>
            </aside>
          </div>
        ) : null}

        {tab === "Flashcards" ? (
          <div>
            {cards.length < pack.flashcards.length ? (
              <p className="mb-4 rounded-2xl border border-line bg-card px-4 py-3 text-sm text-muted">
                Free includes {cards.length} of {pack.flashcards.length} cards. Upgrade to Student for the full deck.
              </p>
            ) : null}
            <FlashcardDeck cards={cards} />
          </div>
        ) : null}

        {tab === "Quiz" ? (
          quizAllowed ? (
            <QuizPlayer questions={pack.quiz} />
          ) : (
            <p className="rounded-3xl border border-line bg-card p-8 text-muted">
              Quizzes unlock on the Student plan. The questions are already generated — upgrade to sit them.
            </p>
          )
        ) : null}

        {tab === "Study guide" ? (
          <div className="space-y-5">
            {pack.studyGuide.map((section) => (
              <section key={section.heading} className="rounded-3xl border border-line bg-card p-6 sm:p-8">
                <h2 className="serif text-2xl">{section.heading}</h2>
                <p className="mt-3 leading-7 text-muted">{section.body}</p>
              </section>
            ))}
            {pack.outline.map((section) => (
              <section key={section.heading} className="rounded-3xl border border-line bg-card p-6">
                <h3 className="font-medium">{section.heading}</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
