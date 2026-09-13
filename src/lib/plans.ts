import type { Plan, StudyPack } from "@/lib/types";

export const PLAN_LIMITS = {
  free: {
    name: "Free",
    price: 0,
    period: "forever",
    packsPerMonth: 3,
    maxFlashcards: 20,
    quiz: false,
    ankiExport: false,
    maxAudioMinutes: 20,
    blurb: "Try Lectura on a few lectures this term.",
    features: [
      "3 study packs each month",
      "Slide and short audio summaries",
      "Up to 20 flashcards per pack",
    ],
  },
  student: {
    name: "Student",
    price: 8,
    period: "month",
    packsPerMonth: Infinity,
    maxFlashcards: Infinity,
    quiz: true,
    ankiExport: false,
    maxAudioMinutes: 90,
    blurb: "Unlimited packs for seminar season.",
    features: [
      "Unlimited lecture and slide packs",
      "Full flashcard decks",
      "Exam-style quizzes and study guides",
      "Recordings up to 90 minutes",
    ],
  },
  pro: {
    name: "Pro",
    price: 16,
    period: "month",
    packsPerMonth: Infinity,
    maxFlashcards: Infinity,
    quiz: true,
    ankiExport: true,
    maxAudioMinutes: 180,
    blurb: "Long recordings, Anki export, exam mode.",
    features: [
      "Everything in Student",
      "Recordings up to 3 hours",
      "Anki CSV export",
      "Priority generation when AI is enabled",
    ],
  },
} as const;

export function visibleFlashcards(pack: StudyPack, plan: Plan) {
  const limit = PLAN_LIMITS[plan].maxFlashcards;
  if (!Number.isFinite(limit)) return pack.flashcards;
  return pack.flashcards.slice(0, limit);
}

export function canTakeQuiz(plan: Plan) {
  return PLAN_LIMITS[plan].quiz;
}

export function canExportAnki(plan: Plan) {
  return PLAN_LIMITS[plan].ankiExport;
}
