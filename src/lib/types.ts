export type Plan = "free" | "student" | "pro";

export type User = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  plan: Plan;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus?: string;
  createdAt: string;
};

export type Slide = {
  number: number;
  title: string;
  bullets: string[];
  notes?: string;
};

export type Flashcard = {
  id: string;
  front: string;
  back: string;
  hint?: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

export type OutlineSection = {
  heading: string;
  points: string[];
};

export type GuideSection = {
  heading: string;
  body: string;
};

export type StudyPack = {
  id: string;
  userId: string;
  title: string;
  course?: string;
  sourceType: "slides" | "lecture" | "mixed";
  fileName?: string;
  status: "ready" | "processing" | "failed";
  usedAi: boolean;
  transcript?: string;
  summary: string;
  keyTakeaways: string[];
  outline: OutlineSection[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  studyGuide: GuideSection[];
  examTips: string[];
  createdAt: string;
};

export type Database = {
  users: User[];
  packs: StudyPack[];
};

export type PublicUser = Omit<User, "passwordHash">;
