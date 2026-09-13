import type { StudyPack } from "@/lib/types";

export function samplePackFor(userId: string): StudyPack {
  return {
    id: "sample-memory-systems",
    userId,
    title: "Memory systems and encoding",
    course: "PSYC 201 · Cognitive Psychology",
    sourceType: "slides",
    fileName: "Week-03-Memory.pptx",
    status: "ready",
    usedAi: false,
    summary:
      "This lecture maps human memory onto three interacting stores — sensory, short-term/working, and long-term — then shows how encoding quality, not time in short-term store, predicts later recall. The Atkinson–Shiffrin modal model is treated as a useful skeleton, then revised with Baddeley’s working-memory components and levels-of-processing evidence. Exam pressure points are the differences between maintenance and elaborative rehearsal, why chunking expands working-memory span, and how retrieval cues make ‘forgotten’ material available again.",
    keyTakeaways: [
      "Capacity and duration differ sharply across sensory, working, and long-term memory.",
      "Working memory is not a passive box; it is an attention-limited workspace with specialised buffers.",
      "Deep, elaborative encoding beats rote rehearsal for durable exam recall.",
      "Retrieval is cue-dependent: context and organisation at study become the path back at test.",
    ],
    outline: [
      {
        heading: "The modal model",
        points: [
          "Sensory memory holds a brief literal trace (iconic ~250ms, echoic ~2–4s).",
          "Short-term store was originally described as ~7±2 items for ~15–30s without rehearsal.",
          "Long-term memory is treated as high-capacity and relatively durable.",
        ],
      },
      {
        heading: "Working memory (Baddeley)",
        points: [
          "Central executive allocates attention and coordinates buffers.",
          "Phonological loop handles verbal rehearsal; visuospatial sketchpad handles imagery.",
          "Episodic buffer binds multimodal chunks into scenes.",
        ],
      },
      {
        heading: "Encoding and retrieval",
        points: [
          "Maintenance rehearsal recycles items; elaborative rehearsal links them to meaning.",
          "Levels of processing: structural < phonemic < semantic.",
          "Encoding specificity: cues present at study help most at test.",
        ],
      },
    ],
    flashcards: [
      {
        id: "c1",
        front: "What is the modal model of memory?",
        back: "Atkinson and Shiffrin’s three-store account: sensory memory → short-term memory → long-term memory, with rehearsal controlling transfer.",
      },
      {
        id: "c2",
        front: "Typical duration of iconic memory?",
        back: "About 250 milliseconds. It is a visual sensory trace that decays unless attention selects it.",
      },
      {
        id: "c3",
        front: "What did Miller mean by 7±2?",
        back: "The classic estimate of short-term memory span in chunks, not raw bits. Chunking can expand effective capacity.",
      },
      {
        id: "c4",
        front: "Working memory vs short-term memory?",
        back: "Short-term memory is a storage description. Working memory is an active, attention-limited workspace with specialised components.",
      },
      {
        id: "c5",
        front: "Name Baddeley’s four working-memory components.",
        back: "Central executive, phonological loop, visuospatial sketchpad, and episodic buffer.",
        hint: "One is the boss, two are slave systems, one binds.",
      },
      {
        id: "c6",
        front: "What does the phonological loop do?",
        back: "It briefly stores and rehearses verbal material. The word-length effect and articulatory suppression are classic evidence.",
      },
      {
        id: "c7",
        front: "Maintenance vs elaborative rehearsal?",
        back: "Maintenance repeats the item to keep it in mind. Elaborative rehearsal connects it to meaning, examples, or prior knowledge — and predicts better long-term recall.",
      },
      {
        id: "c8",
        front: "Levels-of-processing claim?",
        back: "Deeper (semantic) encoding produces more durable memory than shallow (structural or phonemic) encoding, even with equal study time.",
      },
      {
        id: "c9",
        front: "What is encoding specificity?",
        back: "Retrieval succeeds when cues at test match the way the material was encoded. Context and semantic organisation both count.",
      },
      {
        id: "c10",
        front: "Why does chunking help?",
        back: "Working memory is limited in chunks. Recoding items into meaningful groups (e.g. 1492 as a year) reduces load.",
      },
      {
        id: "c11",
        front: "Proactive vs retroactive interference?",
        back: "Proactive: old learning disrupts new. Retroactive: new learning disrupts old. Both are major exam-relevant forgetting mechanisms.",
      },
      {
        id: "c12",
        front: "Availability vs accessibility?",
        back: "A memory can be stored (available) but not currently retrievable (inaccessible) until a better cue is supplied.",
      },
    ],
    quiz: [
      {
        id: "q1",
        question: "Which statement best captures working memory?",
        options: [
          "A permanent archive of autobiographical events",
          "An attention-limited workspace that briefly holds and manipulates information",
          "A purely visual sensory register lasting a few minutes",
          "The same thing as long-term semantic memory",
        ],
        answerIndex: 1,
        explanation:
          "Working memory is the active workspace. Long-term stores are separate, and sensory memory is much briefer.",
      },
      {
        id: "q2",
        question: "Elaborative rehearsal is most likely to improve exam performance because it…",
        options: [
          "Increases the number of times an item is silently repeated",
          "Keeps items circulating in the phonological loop indefinitely",
          "Creates richer retrieval routes by linking material to meaning",
          "Converts iconic traces into echoic traces",
        ],
        answerIndex: 2,
        explanation:
          "Meaning-based links, not mere repetition, are what transfer well to long-term retrieval.",
      },
      {
        id: "q3",
        question: "The word-length effect is evidence for which component?",
        options: [
          "Visuospatial sketchpad",
          "Phonological loop",
          "Semantic long-term store",
          "Iconic memory",
        ],
        answerIndex: 1,
        explanation:
          "Shorter words are recalled better because they can be rehearsed more times in the loop before decay.",
      },
      {
        id: "q4",
        question: "A student studies in the library and is tested in a noisy hall. Encoding specificity predicts…",
        options: [
          "No effect, because memory is content-addressable only",
          "Better recall if internal/external cues mismatch the study context",
          "Poorer recall if test cues differ from those present during encoding",
          "That only maintenance rehearsal will be affected",
        ],
        answerIndex: 2,
        explanation:
          "Mismatch of cues (place, mood, organisation) reduces accessibility even if the memory is still stored.",
      },
      {
        id: "q5",
        question: "Miller’s 7±2 estimate is best interpreted as a limit on…",
        options: [
          "Raw bits of visual information",
          "The number of meaningful chunks in short-term/working memory",
          "Lifetime long-term memory capacity",
          "The duration of echoic memory in seconds",
        ],
        answerIndex: 1,
        explanation:
          "Span is counted in chunks. Expertise and recoding change how much each chunk contains.",
      },
    ],
    studyGuide: [
      {
        heading: "If you only reread one page",
        body: "Memory is a set of systems with different limits. Sensory memory is ultra-brief. Working memory is small and attention-hungry. Long-term memory is large but cue-dependent. Your job before an exam is to encode deeply and practise retrieving with the kinds of cues the paper will actually give you.",
      },
      {
        heading: "Compare and contrast table",
        body: "Sensory: high fidelity, milliseconds–seconds, pre-categorical. Working memory: 4–7 chunks, seconds unless rehearsed, actively manipulated. Long-term: vast, minutes to years, organised by meaning and association. Do not write ‘STM lasts 30 seconds so LTM is everything else’ — that is the outdated modal-model slogan, not the full answer.",
      },
      {
        heading: "How to use this in an essay",
        body: "Open with the modal model, then immediately upgrade it (Baddeley; levels of processing). Use one classic effect per component (word-length, dual-task interference, semantic vs case judgement). End on educational implications: self-testing beats highlighting because it practises retrieval, not just availability.",
      },
    ],
    examTips: [
      "If a question says ‘evaluate the modal model’, do not only describe the three boxes — say what working memory and levels-of-processing added.",
      "Define chunking with an example (phone numbers, dates, chess positions) or you will lose an easy mark.",
      "Keep availability vs accessibility ready for any ‘why did I forget?’ short-answer.",
    ],
    createdAt: "2026-09-08T09:00:00.000Z",
  };
}
