import { UploadForm } from "@/components/upload-form";
import { hasOpenAI } from "@/lib/openai";

export default function NewPackPage() {
  return (
    <main>
      <h1 className="serif text-4xl">New study pack</h1>
      <p className="mt-2 max-w-xl text-muted">
        Upload a .pptx deck, a lecture recording, or both.{" "}
        {hasOpenAI()
          ? "AI rewriting is on — packs will be tightened for exams."
          : "No OpenAI key yet, so slide packs are built from the deck itself. Recordings need a key for transcription."}
      </p>
      <div className="mt-8">
        <UploadForm />
      </div>
    </main>
  );
}
