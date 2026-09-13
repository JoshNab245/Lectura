"use client";

import { useActionState, useMemo, useState } from "react";
import { createStudyPack, type PackActionState } from "@/app/actions/packs";
import { extractPptx } from "@/lib/pptx";
import type { Slide } from "@/lib/types";

const accept = ".pptx,audio/*,video/mp4,video/webm,.mp3,.m4a,.wav,.mp4,.webm";

export function UploadForm() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [fileLabel, setFileLabel] = useState("Drop a .pptx deck or lecture recording");
  const [parsing, setParsing] = useState(false);
  const [localError, setLocalError] = useState<string>();
  const [state, action, pending] = useActionState(createStudyPack, undefined as PackActionState);

  const preview = useMemo(() => slides.slice(0, 6), [slides]);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setLocalError(undefined);
    setFileLabel(file.name);
    if (!file.name.toLowerCase().endsWith(".pptx")) {
      setSlides([]);
      return;
    }
    setParsing(true);
    try {
      const extracted = await extractPptx(await file.arrayBuffer());
      if (!extracted.length) {
        setLocalError("No readable text in that deck. Try exporting again as .pptx.");
      }
      setSlides(extracted);
    } catch {
      setLocalError("Could not parse that PowerPoint file.");
      setSlides([]);
    } finally {
      setParsing(false);
    }
  }

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="slides" value={JSON.stringify(slides)} />
      <label
        className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-navy/30 bg-card px-6 py-12 text-center"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const file = event.dataTransfer.files[0];
          const input = event.currentTarget.querySelector("input");
          if (file && input) {
            const transfer = new DataTransfer();
            transfer.items.add(file);
            input.files = transfer.files;
            void onFile(file);
          }
        }}
      >
        <input
          type="file"
          name="file"
          accept={accept}
          className="hidden"
          onChange={(event) => void onFile(event.target.files?.[0])}
        />
        <p className="serif text-2xl">Drop the week’s materials</p>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted">
          PowerPoint is parsed in the browser. Lecture audio or video is transcribed when an OpenAI
          key is configured.
        </p>
        <p className="mt-4 rounded-full bg-paper px-4 py-2 text-sm text-navy">{fileLabel}</p>
        {parsing ? <p className="mt-3 text-sm text-sage">Reading slides…</p> : null}
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm text-muted">Module / course (optional)</span>
          <input
            name="course"
            placeholder="PSYC 201"
            className="w-full rounded-xl border border-line bg-card px-3.5 py-2.5 outline-none ring-clay/30 focus:ring-2"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm text-muted">Title override (optional)</span>
          <input
            name="title"
            placeholder="Week 3 memory"
            className="w-full rounded-xl border border-line bg-card px-3.5 py-2.5 outline-none ring-clay/30 focus:ring-2"
          />
        </label>
      </div>

      {preview.length ? (
        <div className="rounded-2xl border border-line bg-card p-4">
          <p className="text-sm font-medium text-navy">
            {slides.length} slides ready
          </p>
          <ol className="mt-3 space-y-2 text-sm text-muted">
            {preview.map((slide) => (
              <li key={slide.number}>
                <span className="text-ink">{slide.number}.</span> {slide.title}
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {localError || state?.error ? (
        <p className="text-sm text-clay">{localError ?? state?.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending || parsing}
        className="rounded-full bg-clay px-6 py-3 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? "Building your study pack…" : "Create study pack"}
      </button>
    </form>
  );
}
