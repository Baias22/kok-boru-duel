import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadQuestions, saveQuestions, newId, type Question } from "@/lib/questions-store";

export const Route = createFileRoute("/questions")({
  component: QuestionsPage,
  head: () => ({
    meta: [
      { title: "Manage Questions — Kok Boru Arena" },
      { name: "description", content: "Add, edit, and delete questions for the Kok Boru classroom game." },
    ],
  }),
});

function emptyDraft(): Question {
  return { id: newId(), text: "", options: ["", "", "", ""], correctIndex: 0 };
}

function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [draft, setDraft] = useState<Question>(emptyDraft());
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setQuestions(loadQuestions());
  }, []);

  function persist(next: Question[]) {
    setQuestions(next);
    saveQuestions(next);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.text.trim() || draft.options.some((o) => !o.trim())) return;
    if (editingId) {
      persist(questions.map((q) => (q.id === editingId ? { ...draft, id: editingId } : q)));
    } else {
      persist([...questions, draft]);
    }
    setDraft(emptyDraft());
    setEditingId(null);
  }

  function startEdit(q: Question) {
    setDraft({ ...q, options: [...q.options] as Question["options"] });
    setEditingId(q.id);
  }

  function cancelEdit() {
    setDraft(emptyDraft());
    setEditingId(null);
  }

  function remove(id: string) {
    if (!confirm("Delete this question?")) return;
    persist(questions.filter((q) => q.id !== id));
    if (editingId === id) cancelEdit();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[oklch(0.97_0.02_80)] to-[oklch(0.93_0.04_140)] p-4 md:p-6">
      <header className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <Link to="/" className="text-xl font-extrabold">Kok Boru Arena</Link>
        <Link to="/game" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold">
          Back to Game
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <section className="bg-card rounded-2xl p-6 shadow border border-border">
          <h2 className="text-2xl font-bold mb-4">{editingId ? "Edit question" : "Add a question"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Question</label>
              <textarea
                value={draft.text}
                onChange={(e) => setDraft({ ...draft, text: e.target.value })}
                rows={2}
                required
                className="w-full rounded-lg border border-input p-3 bg-background"
              />
            </div>
            {draft.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correct"
                  checked={draft.correctIndex === i}
                  onChange={() => setDraft({ ...draft, correctIndex: i as 0 | 1 | 2 | 3 })}
                />
                <span className="font-bold w-6">{String.fromCharCode(65 + i)}</span>
                <input
                  value={opt}
                  onChange={(e) => {
                    const opts = [...draft.options] as Question["options"];
                    opts[i] = e.target.value;
                    setDraft({ ...draft, options: opts });
                  }}
                  required
                  className="flex-1 rounded-lg border border-input p-2 bg-background"
                />
              </div>
            ))}
            <p className="text-xs text-muted-foreground">Select the radio for the correct answer.</p>
            <div className="flex gap-2">
              <button type="submit" className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold">
                {editingId ? "Save changes" : "Add question"}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="px-5 py-2.5 rounded-lg bg-secondary text-secondary-foreground font-bold">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="bg-card rounded-2xl p-6 shadow border border-border">
          <h2 className="text-2xl font-bold mb-4">Questions ({questions.length})</h2>
          {questions.length < 2 && (
            <div className="mb-4 rounded-lg bg-yellow-100 border border-yellow-400 px-3 py-2 text-yellow-900 text-sm">
              Add at least 2 questions so each team can get a different one.
            </div>
          )}
          <ul className="space-y-3 max-h-[60vh] overflow-auto">
            {questions.map((q) => (
              <li key={q.id} className="rounded-lg border border-border p-3">
                <div className="font-medium">{q.text}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Correct: {String.fromCharCode(65 + q.correctIndex)} — {q.options[q.correctIndex]}
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => startEdit(q)} className="text-sm px-3 py-1 rounded bg-secondary text-secondary-foreground font-medium">Edit</button>
                  <button onClick={() => remove(q.id)} className="text-sm px-3 py-1 rounded bg-destructive text-destructive-foreground font-medium">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
