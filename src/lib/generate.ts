import { z } from "zod";
import { getOpenAI, hasOpenAI } from "@/lib/openai";
import { slidesToSourceText } from "@/lib/pptx";
import type { GuideSection, OutlineSection, Slide, StudyPack } from "@/lib/types";
import { newId, nowIso, truncate } from "@/lib/utils";

const materialsSchema = z.object({
  title: z.string(),
  course: z.string().optional(),
  summary: z.string(),
  keyTakeaways: z.array(z.string()).min(3),
  outline: z.array(
    z.object({
      heading: z.string(),
      points: z.array(z.string()),
    }),
  ),
  flashcards: z.array(
    z.object({
      front: z.string(),
      back: z.string(),
      hint: z.string().optional(),
    }),
  ),
  quiz: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()).min(2).max(4),
      answerIndex: z.number().int().nonnegative(),
      explanation: z.string(),
    }),
  ),
  studyGuide: z.array(
    z.object({
      heading: z.string(),
      body: z.string(),
    }),
  ),
  examTips: z.array(z.string()),
});

type Materials = z.infer<typeof materialsSchema>;

function filenameToTitle(fileName?: string) {
  if (!fileName) return "Untitled lecture";
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function heuristicMaterials(input: {
  slides: Slide[];
  transcript?: string;
  fileName?: string;
}): Materials {
  const { slides, transcript, fileName } = input;
  const title = slides[0]?.title || filenameToTitle(fileName);
  const headings = slides.map((slide) => slide.title).filter(Boolean);
  const bullets = slides.flatMap((slide) => slide.bullets);

  const summaryParts = [
    slides.length
      ? `This pack is built from ${slides.length} slides${transcript ? " plus a lecture transcript" : ""}, centred on ${title}.`
      : `This pack is built from a lecture recording titled ${title}.`,
    headings.length
      ? `The through-line moves across ${headings.slice(0, 8).join("; ")}${headings.length > 8 ? ", and related sections" : ""}.`
      : "",
    transcript
      ? truncate(transcript.replace(/\s+/g, " "), 420)
      : bullets.slice(0, 4).join(" "),
  ].filter(Boolean);

  const outline: OutlineSection[] = slides.length
    ? slides.slice(0, 16).map((slide) => ({
        heading: slide.title,
        points: slide.bullets.slice(0, 6),
      }))
    : [
        {
          heading: title,
          points: (transcript ?? "")
            .split(/(?<=[.!?])\s+/)
            .filter((sentence) => sentence.length > 40)
            .slice(0, 8),
        },
      ];

  const flashcards: Materials["flashcards"] = [];
  for (const slide of slides) {
    if (slide.bullets.length) {
      flashcards.push({
        front: `What should you remember about “${slide.title}”?`,
        back: slide.bullets.join(" • "),
      });
    }
    for (const bullet of slide.bullets) {
      const definition = bullet.split(/[:–—-]/);
      if (definition.length >= 2 && definition[0].trim().length < 80) {
        flashcards.push({
          front: `Define: ${definition[0].trim()}`,
          back: definition.slice(1).join("—").trim(),
        });
      }
    }
  }

  if (transcript) {
    const sentences = transcript
      .split(/(?<=[.!?])\s+/)
      .map((item) => item.trim())
      .filter((item) => item.length > 50);
    for (const sentence of sentences.slice(0, 8)) {
      flashcards.push({
        front: "From the lecture, complete this idea",
        back: sentence,
      });
    }
  }

  if (!flashcards.length) {
    flashcards.push({
      front: `What is this lecture about?`,
      back: title,
    });
  }

  const quizBank = slides.filter((slide) => slide.bullets.length >= 1).slice(0, 6);
  const quiz: Materials["quiz"] = quizBank.map((slide, index) => {
    const correct = slide.bullets[0];
    const distractors = slides
      .filter((other) => other.number !== slide.number)
      .flatMap((other) => other.bullets)
      .filter((item) => item !== correct)
      .slice(index, index + 3);
    while (distractors.length < 3) distractors.push("None of the above is the best fit.");
    const options = [correct, ...distractors.slice(0, 3)];
    return {
      question: `Which point belongs with “${slide.title}”?`,
      options,
      answerIndex: 0,
      explanation: `${slide.title} is supported by: ${slide.bullets.slice(0, 2).join(" ")}`,
    };
  });

  const studyGuide: GuideSection[] = [
    {
      heading: "Compressed walkthrough",
      body: summaryParts.join(" "),
    },
    ...outline.slice(0, 8).map((section) => ({
      heading: section.heading,
      body: section.points.join(" "),
    })),
  ];

  return {
    title,
    course: undefined,
    summary: summaryParts.join(" "),
    keyTakeaways: (headings.length ? headings : bullets).slice(0, 6),
    outline,
    flashcards: flashcards.slice(0, 40),
    quiz: quiz.slice(0, 8),
    studyGuide,
    examTips: [
      "Start from the slide titles — they are usually the essay skeleton.",
      "Turn each heading into a ‘compare/define/evaluate’ prompt and answer it aloud.",
      "Anything that appeared as a labelled definition is fair game for a short-answer question.",
    ],
  };
}

async function aiMaterials(source: string): Promise<Materials> {
  const openai = getOpenAI();
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You create rigorous university study packs from lecture slides and transcripts. Audience: undergraduates revising for exams. Avoid fluff. Prefer precise terms, compare/contrast structure, and exam-style questions. Return JSON with keys: title, course, summary, keyTakeaways (array), outline (array of {heading, points}), flashcards (array of {front, back, hint?}), quiz (array of {question, options[4], answerIndex, explanation}), studyGuide (array of {heading, body}), examTips (array). Make 12-24 flashcards and 5-8 quiz questions.",
      },
      {
        role: "user",
        content: source.slice(0, 24000),
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("Empty model response");
  return materialsSchema.parse(JSON.parse(raw));
}

function withIds(materials: Materials): Pick<
  StudyPack,
  | "title"
  | "course"
  | "summary"
  | "keyTakeaways"
  | "outline"
  | "flashcards"
  | "quiz"
  | "studyGuide"
  | "examTips"
> {
  return {
    title: materials.title,
    course: materials.course,
    summary: materials.summary,
    keyTakeaways: materials.keyTakeaways,
    outline: materials.outline,
    flashcards: materials.flashcards.map((card) => ({ ...card, id: newId() })),
    quiz: materials.quiz.map((item) => ({ ...item, id: newId() })),
    studyGuide: materials.studyGuide,
    examTips: materials.examTips,
  };
}

export async function buildStudyPack(input: {
  userId: string;
  slides?: Slide[];
  transcript?: string;
  fileName?: string;
  sourceType: StudyPack["sourceType"];
}) {
  const slides = input.slides ?? [];
  const source = [slidesToSourceText(slides), input.transcript].filter(Boolean).join("\n\n");
  let usedAi = false;
  let materials: Materials;

  if (hasOpenAI() && source.trim()) {
    try {
      materials = await aiMaterials(source);
      usedAi = true;
    } catch {
      materials = heuristicMaterials({
        slides,
        transcript: input.transcript,
        fileName: input.fileName,
      });
    }
  } else {
    materials = heuristicMaterials({
      slides,
      transcript: input.transcript,
      fileName: input.fileName,
    });
  }

  const shaped = withIds(materials);
  const pack: StudyPack = {
    id: newId(),
    userId: input.userId,
    sourceType: input.sourceType,
    fileName: input.fileName,
    status: "ready",
    usedAi,
    transcript: input.transcript,
    createdAt: nowIso(),
    ...shaped,
  };
  return pack;
}
