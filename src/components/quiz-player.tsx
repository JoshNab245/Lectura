"use client";

import { useMemo, useState } from "react";
import type { QuizQuestion } from "@/lib/types";
import { cn } from "@/lib/utils";

export function QuizPlayer({ questions }: { questions: QuizQuestion[] }) {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const question = questions[index];
  const remaining = questions.length - index;

  const progress = useMemo(
    () => (questions.length ? Math.round((index / questions.length) * 100) : 0),
    [index, questions.length],
  );

  if (!questions.length) return <p className="text-muted">No quiz in this pack.</p>;

  if (done) {
    return (
      <div className="rounded-3xl border border-line bg-card p-8">
        <p className="text-sm uppercase tracking-[0.18em] text-clay">Result</p>
        <p className="serif mt-3 text-4xl">
          {score}/{questions.length}
        </p>
        <p className="mt-3 max-w-lg text-muted">
          {score / questions.length >= 0.8
            ? "Strong. Convert the misses into extra flashcards before the paper."
            : "Treat the misses as the revision list. Flip those cards until the explanations feel obvious."}
        </p>
        <button
          type="button"
          className="mt-6 rounded-full bg-navy px-4 py-2 text-sm text-card"
          onClick={() => {
            setIndex(0);
            setChoice(null);
            setScore(0);
            setDone(false);
          }}
        >
          Retry quiz
        </button>
      </div>
    );
  }

  const locked = choice !== null;

  return (
    <div>
      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-line">
        <div className="h-full bg-clay" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-sm text-muted">
        Question {index + 1} of {questions.length} · {remaining} remaining
      </p>
      <h2 className="serif mt-3 text-3xl leading-snug">{question.question}</h2>
      <div className="mt-6 space-y-3">
        {question.options.map((option, optionIndex) => {
          const isCorrect = optionIndex === question.answerIndex;
          const isPicked = choice === optionIndex;
          return (
            <button
              key={`${optionIndex}-${option}`}
              type="button"
              disabled={locked}
              onClick={() => {
                setChoice(optionIndex);
                if (isCorrect) setScore((value) => value + 1);
              }}
              className={cn(
                "w-full rounded-2xl border px-4 py-3 text-left text-sm leading-6",
                !locked && "border-line bg-card hover:border-navy",
                locked && isCorrect && "border-sage bg-sage/10",
                locked && isPicked && !isCorrect && "border-clay bg-clay/10",
                locked && !isPicked && !isCorrect && "border-line bg-card opacity-70",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
      {locked ? (
        <div className="mt-5">
          <p className="text-sm leading-6 text-muted">{question.explanation}</p>
          <button
            type="button"
            className="mt-4 rounded-full bg-navy px-4 py-2 text-sm text-card"
            onClick={() => {
              if (index + 1 >= questions.length) {
                setDone(true);
                return;
              }
              setIndex((value) => value + 1);
              setChoice(null);
            }}
          >
            {index + 1 >= questions.length ? "See score" : "Next question"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
