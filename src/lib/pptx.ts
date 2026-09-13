import JSZip from "jszip";
import type { Slide } from "@/lib/types";
import { decodeXml } from "@/lib/utils";

function slideNumber(name: string) {
  const match = name.match(/slide(\d+)\.xml$/);
  return match ? Number(match[1]) : 0;
}

function paragraphsFromXml(xml: string) {
  return xml
    .split(/<\/a:p>/i)
    .map((chunk) => {
      const runs = [...chunk.matchAll(/<a:t(?:\s[^>]*)?>([^<]*)<\/a:t>/gi)].map((match) =>
        decodeXml(match[1]),
      );
      return runs.join("").replace(/\s+/g, " ").trim();
    })
    .filter(Boolean);
}

export async function extractPptx(data: ArrayBuffer | Uint8Array): Promise<Slide[]> {
  const zip = await JSZip.loadAsync(data);
  const slideNames = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/i.test(name))
    .sort((a, b) => slideNumber(a) - slideNumber(b));

  const notesBySlide = new Map<number, string>();
  const noteNames = Object.keys(zip.files).filter((name) =>
    /^ppt\/notesSlides\/notesSlide\d+\.xml$/i.test(name),
  );
  for (const name of noteNames) {
    const xml = await zip.files[name].async("text");
    const texts = paragraphsFromXml(xml).filter(
      (text) => !/^\d+$/.test(text) && text.toLowerCase() !== "notes",
    );
    const num = Number(name.match(/notesSlide(\d+)\.xml$/i)?.[1] ?? 0);
    if (texts.length) notesBySlide.set(num, texts.join(" "));
  }

  const slides: Slide[] = [];
  for (const name of slideNames) {
    const xml = await zip.files[name].async("text");
    const texts = paragraphsFromXml(xml);
    const number = slideNumber(name);
    if (!texts.length) continue;
    slides.push({
      number,
      title: texts[0],
      bullets: texts.slice(1),
      notes: notesBySlide.get(number),
    });
  }

  return slides;
}

export function slidesToSourceText(slides: Slide[]) {
  return slides
    .map((slide) => {
      const bullets = slide.bullets.map((item) => `- ${item}`).join("\n");
      const notes = slide.notes ? `\nNotes: ${slide.notes}` : "";
      return `Slide ${slide.number}: ${slide.title}\n${bullets}${notes}`;
    })
    .join("\n\n");
}
