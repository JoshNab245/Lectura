"use server";

import { promises as fs } from "node:fs";
import path from "node:path";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { countPacksThisMonth, savePack } from "@/lib/db";
import { buildStudyPack } from "@/lib/generate";
import { hasOpenAI, transcribeAudio } from "@/lib/openai";
import { PLAN_LIMITS } from "@/lib/plans";
import { extractPptx } from "@/lib/pptx";
import type { Slide } from "@/lib/types";

export type PackActionState = { error?: string } | undefined;

function parseSlidesField(value: FormDataEntryValue | null): Slide[] {
  if (!value || typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value) as Slide[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export async function createStudyPack(
  _prev: PackActionState,
  formData: FormData,
): Promise<PackActionState> {
  const user = await requireUser();
  const usedThisMonth = await countPacksThisMonth(user.id);
  if (usedThisMonth >= PLAN_LIMITS[user.plan].packsPerMonth) {
    return {
      error: `The ${PLAN_LIMITS[user.plan].name} plan includes ${PLAN_LIMITS[user.plan].packsPerMonth} packs this month. Upgrade to keep going.`,
    };
  }

  const file = formData.get("file");
  const slides = parseSlidesField(formData.get("slides"));
  const course = String(formData.get("course") ?? "").trim() || undefined;
  const titleOverride = String(formData.get("title") ?? "").trim();

  let transcript: string | undefined;
  let fileName: string | undefined;
  let sourceType: "slides" | "lecture" | "mixed" = slides.length ? "slides" : "lecture";

  if (file instanceof File && file.size > 0) {
    fileName = file.name;
    const ext = file.name.toLowerCase();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (ext.endsWith(".pptx")) {
      const extracted = slides.length ? slides : await extractPptx(arrayBuffer);
      if (!extracted.length) return { error: "We could not read any text from that deck." };
      sourceType = transcript ? "mixed" : "slides";
      const pack = await buildStudyPack({
        userId: user.id,
        slides: extracted,
        fileName,
        sourceType,
      });
      if (titleOverride) pack.title = titleOverride;
      if (course) pack.course = course;
      await savePack(pack);
      redirect(`/app/packs/${pack.id}`);
    }

    const audioLike = /\.(mp3|m4a|wav|mp4|webm|mpeg|mpga)$/i.test(ext);
    if (!audioLike) {
      return { error: "Use a .pptx deck or an audio/video lecture file." };
    }

    const uploadDir = path.join(process.cwd(), "data", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, `${crypto.randomUUID()}-${file.name}`), buffer);

    if (hasOpenAI()) {
      try {
        transcript = await transcribeAudio(buffer, file.name);
      } catch {
        return { error: "Transcription failed. Check the OpenAI key or try a smaller file." };
      }
    } else {
      transcript =
        "Transcription needs an OPENAI_API_KEY. Add one to .env.local, restart the server, and re-upload the lecture. Slide decks still work without a key.";
    }
    sourceType = slides.length ? "mixed" : "lecture";
  }

  if (!slides.length && !transcript) {
    return { error: "Drop a PowerPoint deck or a recorded lecture to continue." };
  }

  const pack = await buildStudyPack({
    userId: user.id,
    slides,
    transcript,
    fileName,
    sourceType,
  });
  if (titleOverride) pack.title = titleOverride;
  if (course) pack.course = course;
  await savePack(pack);
  redirect(`/app/packs/${pack.id}`);
}
