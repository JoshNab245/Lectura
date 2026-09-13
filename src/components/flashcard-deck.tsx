"use client";

import { useEffect, useState } from "react";
import type { Flashcard } from "@/lib/types";

export function FlashcardDeck({ cards }: { cards: Flashcard[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = cards[index];

  useEffect(() => {
    function next() {
      setFlipped(false);
      setIndex((value) => (value + 1) % Math.max(cards.length, 1));
    }
    function prev() {
      setFlipped(false);
      setIndex((value) => (value - 1 + cards.length) % Math.max(cards.length, 1));
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        setFlipped((value) => !value);
      }
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cards.length]);

  function next() {
    setFlipped(false);
    setIndex((value) => (value + 1) % cards.length);
  }

  function prev() {
    setFlipped(false);
    setIndex((value) => (value - 1 + cards.length) % cards.length);
  }

  if (!card) return <p className="text-muted">No flashcards in this pack.</p>;

  return (
    <div>
      <p className="mb-4 text-sm text-muted">
        Card {index + 1} of {cards.length} · space to flip · arrows to move
      </p>
      <button
        type="button"
        onClick={() => setFlipped((value) => !value)}
        className="block w-full [perspective:1400px]"
      >
        <div className={`card-flip relative min-h-[280px] ${flipped ? "is-flipped" : ""}`}>
          <div className="card-face absolute inset-0 rounded-3xl border border-line bg-card p-8 text-left shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-clay">Prompt</p>
            <p className="serif mt-6 text-3xl leading-snug">{card.front}</p>
            {card.hint ? <p className="mt-8 text-sm text-muted">Hint: {card.hint}</p> : null}
          </div>
          <div className="card-face card-back absolute inset-0 rounded-3xl border border-navy/20 bg-navy p-8 text-left text-card">
            <p className="text-xs uppercase tracking-[0.2em] text-gold">Answer</p>
            <p className="mt-6 text-lg leading-8">{card.back}</p>
          </div>
        </div>
      </button>
      <div className="mt-6 flex gap-3">
        <button type="button" onClick={prev} className="rounded-full border border-line px-4 py-2 text-sm">
          Previous
        </button>
        <button type="button" onClick={next} className="rounded-full bg-navy px-4 py-2 text-sm text-card">
          Next
        </button>
      </div>
    </div>
  );
}
