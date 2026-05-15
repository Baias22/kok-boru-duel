import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import GameField from "@/components/GameField";
import QuestionCard from "@/components/QuestionCard";
import { loadQuestions, type Question } from "@/lib/questions-store";

export const Route = createFileRoute("/game")({
  component: GamePage,
  head: () => ({
    meta: [
      { title: "Game — Kok Boru Arena" },
      { name: "description", content: "Play the Kok Boru classroom quiz: two teams, two questions, one carcass." },
    ],
  }),
});

function pickTwoDistinct(pool: Question[], excludeA?: string, excludeB?: string): [Question | null, Question | null] {
  const available = pool.filter((q) => q.id !== excludeA && q.id !== excludeB);
  if (available.length < 2) {
    if (pool.length < 2) return [pool[0] ?? null, null];
    // fallback: just shuffle from pool
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return [shuffled[0], shuffled[1]];
  }
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1]];
}

function pickOne(pool: Question[], exclude: string[]): Question | null {
  const available = pool.filter((q) => !exclude.includes(q.id));
  if (!available.length) {
    const fallback = pool.filter((q) => q.id !== exclude[0]);
    return fallback.length ? fallback[Math.floor(Math.random() * fallback.length)] : null;
  }
  return available[Math.floor(Math.random() * available.length)];
}

function GamePage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [started, setStarted] = useState(false);
  const [position, setPosition] = useState(0);
  const [winner, setWinner] = useState<"A" | "B" | null>(null);
  const [qA, setQA] = useState<Question | null>(null);
  const [qB, setQB] = useState<Question | null>(null);

  useEffect(() => {
    setQuestions(loadQuestions());
  }, []);

  const enoughQuestions = questions.length >= 2;

  function handleStart() {
    if (!enoughQuestions) return;
    const [a, b] = pickTwoDistinct(questions);
    setQA(a);
    setQB(b);
    setPosition(0);
    setWinner(null);
    setStarted(true);
  }

  function handleReset() {
    setStarted(false);
    setPosition(0);
    setWinner(null);
    setQA(null);
    setQB(null);
  }

  function onAnswerA(correct: boolean) {
    if (winner) return;
    if (correct) {
      setPosition((p) => {
        const np = p + 1;
        if (np >= 5) setWinner("A");
        return np;
      });
    }
    // load new question for A — must differ from B's current
    setQA((prev) => pickOne(questions, [prev?.id ?? "", qB?.id ?? ""]));
  }

  function onAnswerB(correct: boolean) {
    if (winner) return;
    if (correct) {
      setPosition((p) => {
        const np = p - 1;
        if (np <= -5) setWinner("B");
        return np;
      });
    }
    setQB((prev) => pickOne(questions, [prev?.id ?? "", qA?.id ?? ""]));
  }

  const teamAColor = "oklch(0.55 0.18 250)";
  const teamBColor = "oklch(0.55 0.18 25)";

  const banner = useMemo(() => {
    if (!enoughQuestions) {
      return (
        <div className="rounded-xl bg-yellow-100 border-2 border-yellow-400 px-5 py-3 text-yellow-900 font-medium">
          Please add more questions (at least 2) before starting.{" "}
          <Link to="/questions" className="underline font-bold">Manage questions</Link>
        </div>
      );
    }
    return null;
  }, [enoughQuestions]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[oklch(0.97_0.02_80)] to-[oklch(0.93_0.04_140)] p-4 md:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <Link to="/" className="text-xl font-extrabold tracking-tight text-foreground">
          Kok Boru Arena
        </Link>
        <div className="flex flex-wrap gap-2">
          {!started ? (
            <button
              onClick={handleStart}
              disabled={!enoughQuestions}
              className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold disabled:opacity-50"
            >
              Start Game
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-lg bg-destructive text-destructive-foreground font-bold"
            >
              Reset Game
            </button>
          )}
          <Link
            to="/questions"
            className="px-5 py-2.5 rounded-lg bg-secondary text-secondary-foreground font-bold"
          >
            Manage Questions
          </Link>
        </div>
      </header>

      {banner}

      {/* Score header */}
      <div className="grid grid-cols-3 items-center gap-4 my-4">
        <div className="text-center font-bold text-lg" style={{ color: teamAColor }}>
          TEAM A →
        </div>
        <div className="text-center text-sm text-muted-foreground">
          First to push the carcass 5 steps wins
        </div>
        <div className="text-center font-bold text-lg" style={{ color: teamBColor }}>
          ← TEAM B
        </div>
      </div>

      {/* Layout: Team A left, field center, Team B right.
          (carcass moves +1 = right toward Team A goal) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-4">
        <QuestionCard
          team="A"
          question={qA}
          disabled={!started || !!winner}
          onAnswer={onAnswerA}
        />
        <div className="flex items-center">
          <GameField position={position} />
        </div>
        <QuestionCard
          team="B"
          question={qB}
          disabled={!started || !!winner}
          onAnswer={onAnswerB}
        />
      </div>

      {!started && enoughQuestions && (
        <div className="mt-6 text-center text-muted-foreground">
          Click <strong>Start Game</strong> to deal questions to both teams.
        </div>
      )}

      {winner && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-10 max-w-md w-full text-center space-y-6 shadow-2xl">
            <div className="text-7xl">🏆</div>
            <h2 className="text-3xl font-extrabold" style={{ color: winner === "A" ? teamAColor : teamBColor }}>
              Team {winner} Wins!
            </h2>
            <p className="text-muted-foreground">Great game! Reset to play again.</p>
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-bold"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
