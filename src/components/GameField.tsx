type Props = { position: number }; // -5..5

function Rider({ color, flip }: { color: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 120 90" width="120" height="90" style={{ transform: flip ? "scaleX(-1)" : undefined }}>
      {/* horse body */}
      <ellipse cx="60" cy="55" rx="38" ry="14" fill="#6b3a2a" />
      {/* neck + head */}
      <path d="M90 50 L105 30 L115 35 L100 55 Z" fill="#6b3a2a" />
      <circle cx="110" cy="33" r="5" fill="#4a2418" />
      {/* legs */}
      <rect x="32" y="60" width="5" height="22" fill="#3a1f15" />
      <rect x="48" y="60" width="5" height="22" fill="#3a1f15" />
      <rect x="78" y="60" width="5" height="22" fill="#3a1f15" />
      <rect x="92" y="60" width="5" height="22" fill="#3a1f15" />
      {/* tail */}
      <path d="M22 50 Q10 55 8 70" stroke="#3a1f15" strokeWidth="4" fill="none" />
      {/* rider body */}
      <rect x="50" y="22" width="20" height="26" rx="4" fill={color} />
      {/* head */}
      <circle cx="60" cy="18" r="8" fill="#f1c89a" />
      {/* hat */}
      <path d="M50 12 L70 12 L66 4 L54 4 Z" fill="#1a1a1a" />
      {/* arm reaching forward (toward carcass) */}
      <rect x="68" y="32" width="22" height="5" rx="2" fill={color} />
    </svg>
  );
}

function Carcass() {
  return (
    <svg viewBox="0 0 60 30" width="60" height="30">
      <ellipse cx="30" cy="18" rx="26" ry="9" fill="#2d2d2d" />
      <ellipse cx="30" cy="16" rx="22" ry="7" fill="#1a1a1a" />
      <circle cx="50" cy="14" r="4" fill="#1a1a1a" />
    </svg>
  );
}

export default function GameField({ position }: Props) {
  // map position -5..5 to 0%..100% (Team B left, Team A right)
  const pct = ((position + 5) / 10) * 100;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-border bg-gradient-to-b from-[oklch(0.75_0.12_140)] to-[oklch(0.55_0.15_140)] shadow-inner" style={{ aspectRatio: "16/9" }}>
      {/* goal zones */}
      <div className="absolute inset-y-0 left-0 w-[10%] bg-[oklch(0.55_0.18_25_/_0.35)] border-r-2 border-dashed border-white/60 flex items-center justify-center">
        <span className="rotate-[-90deg] text-white font-bold tracking-widest">TEAM B GOAL</span>
      </div>
      <div className="absolute inset-y-0 right-0 w-[10%] bg-[oklch(0.55_0.18_250_/_0.35)] border-l-2 border-dashed border-white/60 flex items-center justify-center">
        <span className="rotate-90 text-white font-bold tracking-widest">TEAM A GOAL</span>
      </div>
      {/* center line */}
      <div className="absolute inset-y-0 left-1/2 w-px bg-white/50" />
      <div className="absolute left-1/2 top-2 -translate-x-1/2 text-xs text-white/80">CENTER</div>

      {/* tick marks */}
      {[-4, -3, -2, -1, 1, 2, 3, 4].map((t) => (
        <div
          key={t}
          className="absolute top-1/2 -translate-y-1/2 w-px h-4 bg-white/40"
          style={{ left: `${((t + 5) / 10) * 100}%` }}
        />
      ))}

      {/* Team B rider (left side) */}
      <div className="absolute bottom-[18%] left-[6%]">
        <Rider color="oklch(0.55 0.18 25)" />
      </div>
      {/* Team A rider (right side) */}
      <div className="absolute bottom-[18%] right-[6%]">
        <Rider color="oklch(0.55 0.18 250)" flip />
      </div>

      {/* Carcass — at rider hand level */}
      <div
        className="absolute transition-all duration-700 ease-out"
        style={{ left: `calc(${pct}% - 30px)`, bottom: "32%" }}
      >
        <Carcass />
      </div>

      {/* Position indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/40 text-white text-xs font-mono">
        position: {position}
      </div>
    </div>
  );
}
