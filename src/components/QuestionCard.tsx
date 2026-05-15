import { useState } from "react";
import { motion } from "framer-motion";
import type { Question } from "@/lib/questions-store";
import { cn } from "@/lib/utils";

type Props = {
  team: "A" | "B";
  question: Question | null;
  disabled?: boolean;
  onAnswer: (correct: boolean) => void;
};

export default function QuestionCard({ team, question, disabled, onAnswer }: Props) {
  const [feedback, setFeedback] = useState<null | "correct" | "wrong">(null);
  const [picked, setPicked] = useState<number | null>(null);

  const teamClass = team === "A" ? "team-a" : "team-b";

  function handleClick(idx: number) {
    if (!question || disabled || feedback) return;
    const correct = idx === question.correctIndex;
    setPicked(idx);
    setFeedback(correct ? "correct" : "wrong");
    setTimeout(() => {
      setFeedback(null);
      setPicked(null);
      onAnswer(correct);
    }, 900);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "flex h-full flex-col gap-4 rounded-2xl border-2 bg-card p-4 shadow-sm sm:p-5",
        team === "A" ? "border-team-a/50" : "border-team-b/50",
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-white shadow-md",
            team === "A" ? "bg-team-a" : "bg-team-b",
          )}
        >
          Команда {team}
        </span>
        {feedback && (
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-bold text-white",
              feedback === "correct" ? "bg-emerald-600" : "bg-destructive",
            )}
          >
            {feedback === "correct" ? "Туура!" : "Туура эмес"}
          </span>
        )}
      </div>

      {!question ? (
        <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-muted-foreground">
          Please add more questions
        </div>
      ) : (
        <>
          <h3 className="min-h-[3rem] text-base font-bold text-foreground sm:text-lg">
            {question.text}
          </h3>
          <ul className="grid flex-1 grid-cols-1 gap-2">
            {question.options.map((opt, idx) => {
              const isPicked = picked === idx;
              const showRed = isPicked && feedback === "wrong";
              const showGreen = isPicked && feedback === "correct";
              return (
                <li key={idx}>
                  <button
                    onClick={() => handleClick(idx)}
                    disabled={!!feedback || disabled}
                    className={cn(
                      "flex w-full items-start gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm transition-all",
                      "hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60",
                      showGreen && "border-emerald-600 bg-emerald-500/15 font-semibold",
                      showRed && "border-destructive bg-destructive/15 font-semibold",
                      !showGreen && !showRed && (team === "A"
                        ? "border-border bg-background hover:border-team-a"
                        : "border-border bg-background hover:border-team-b"),
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-6 flex-none items-center justify-center rounded-md text-xs font-bold text-white",
                        team === "A" ? "bg-team-a" : "bg-team-b",
                      )}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
      {/* keep var to avoid TS lint */}
      <span className="hidden">{teamClass}</span>
    </motion.div>
  );
}
