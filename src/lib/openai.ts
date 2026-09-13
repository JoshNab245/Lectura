import OpenAI, { toFile } from "openai";

export function hasOpenAI() {
  return Boolean(process.env.OPENAI_API_KEY);
}

export function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");
  return new OpenAI({ apiKey });
}

export async function transcribeAudio(buffer: Buffer, filename: string) {
  const openai = getOpenAI();
  const file = await toFile(buffer, filename);
  const result = await openai.audio.transcriptions.create({
    file,
    model: "whisper-1",
  });
  return result.text;
}
