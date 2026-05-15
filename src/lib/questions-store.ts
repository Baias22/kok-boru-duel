export type Question = {
  id: string;
  text: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
};

const KEY = "kokboru.questions.v1";

const DEFAULTS: Question[] = [
  { id: "q1", text: "2 + 3 = ?", options: ["4", "5", "6", "7"], correctIndex: 1 },
  { id: "q2", text: "Capital of Kyrgyzstan?", options: ["Almaty", "Tashkent", "Bishkek", "Osh"], correctIndex: 2 },
  { id: "q3", text: "10 × 4 = ?", options: ["14", "40", "44", "30"], correctIndex: 1 },
  { id: "q4", text: "Sun rises in the…", options: ["West", "North", "South", "East"], correctIndex: 3 },
  { id: "q5", text: "How many legs does a horse have?", options: ["2", "3", "4", "6"], correctIndex: 2 },
  { id: "q6", text: "12 ÷ 3 = ?", options: ["2", "3", "4", "6"], correctIndex: 2 },
  { id: "q7", text: "Largest ocean?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], correctIndex: 3 },
  { id: "q8", text: "Color of the sky on a clear day?", options: ["Green", "Blue", "Red", "Yellow"], correctIndex: 1 },
  { id: "q9", text: "9 - 4 = ?", options: ["3", "4", "5", "6"], correctIndex: 2 },
  { id: "q10", text: "Kok Boru is played on…", options: ["Foot", "Bicycles", "Horses", "Cars"], correctIndex: 2 },
];

export function loadQuestions(): Question[] {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Question[];
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export function saveQuestions(qs: Question[]) {
  localStorage.setItem(KEY, JSON.stringify(qs));
}

export function newId() {
  return Math.random().toString(36).slice(2, 10);
}
