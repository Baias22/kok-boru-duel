import { useState } from "react";
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

  const teamColor = team === "A" ? "oklch(0.55 0.18 250)" : "oklch(0.55 0.18 25)";
  const teamBg = team === "A" ? "bg-[oklch(0.95_0.04_250)]" : "bg-[oklch(0.95_0.04_25)]";

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
    <div className={cn("rounded-2xl border-2 p-5 flex flex-col gap-4 h-full", teamBg)} style={{ borderColor: teamColor }}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold" style={{ color: teamColor }}>
          Team {team}
        </h2>
        {feedback && (
          <span
            className={cn(
              "px-3 py-1 rounded-full text-sm font-bold text-white",
              feedback === "correct" ? "bg-green-600" : "bg-red-600",
            )}
          >
            {feedback === "correct" ? "Correct!" : "Wrong!"}
          </span>
        )}
      </div>

      {!question ? (
        <div className="flex-1 flex items-center justify-center text-center text-muted-foreground p-6">
          Please add more questions
        </div>
      ) : (
        <>
          <div className="text-lg md:text-xl font-semibold text-foreground min-h-[3.5rem]">
            {question.text}
          </div>
          <div className="grid grid-cols-1 gap-3 flex-1">
            {question.options.map((opt, idx) => {
              const isPicked = picked === idx;
              const isCorrect = feedback && idx === question.correctIndex;
              const showRed = isPicked && feedback === "wrong";
              const showGreen = (isPicked && feedback === "correct") || isCorrect;
              return (
                <button
                  key={idx}
                  onClick={() => handleClick(idx)}
                  disabled={!!feedback || disabled}
                  className={cn(
                    "w-full text-left text-lg md:text-xl font-medium rounded-xl px-5 py-4 border-2 transition-all",
                    "hover:scale-[1.02] active:scale-[0.99] disabled:cursor-not-allowed",
                    showGreen && "bg-green-500 text-white border-green-700",
                    showRed && "bg-red-500 text-white border-red-700",
                    !showGreen && !showRed && "bg-white border-border hover:border-[var(--ring)]",
                  )}
                >
                  <span className="inline-block w-7 h-7 mr-3 rounded-full text-center leading-7 text-sm font-bold" style={{ backgroundColor: teamColor, color: "white" }}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
