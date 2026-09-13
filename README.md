# Lectura

Turn PowerPoint decks and recorded lectures into summaries, flashcards, quizzes, and exam notes.

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Demo login: `demo@lectura.app` / `lectura123`

## Optional keys

Copy `.env.example` if you need a fresh env file.

- `AUTH_SECRET` — already set for local use
- `OPENAI_API_KEY` — slide packs work without this; add it for tighter rewriting and lecture transcription
- Stripe variables — real checkout; without them, billing uses a local demo upgrade

## What you get

- Accounts and session cookies
- Free / Student / Pro plans
- `.pptx` parsing in the browser
- Audio/video upload (Whisper when OpenAI is configured)
- Study pack workspace: overview, flashcards, quiz, study guide, markdown export
