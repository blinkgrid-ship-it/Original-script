import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { mockAnswers, mockQuestions } from "../data/questionData";

// ── localStorage helpers ─────────────────────────────────────────────────────

function getCodexRead(): number[] {
  return JSON.parse(localStorage.getItem("os_codex_read") ?? "[]");
}

function getConquestDone(): number[] {
  return JSON.parse(localStorage.getItem("os_conquest_done") ?? "[]");
}

function getPathway(): string {
  return localStorage.getItem("os_pathway") ?? "wisdom-seeker";
}

// ── Derived stats ────────────────────────────────────────────────────────────

// Words per chapter in conquest (matches conquestData.ts)
const WORDS_PER_CHAPTER: Record<number, number> = { 1: 5, 2: 3, 3: 3 };
const TOTAL_CHAPTERS = 3;
const TOTAL_WORDS = 11;

function getWordsMastered(): number {
  return getConquestDone().reduce((sum, ch) => sum + (WORDS_PER_CHAPTER[ch] ?? 0), 0);
}

function getLevel(wordsMastered: number, chaptersRead: number): {
  title: string;
  next: string | null;
  xp: number;
  nextXp: number;
} {
  const xp = chaptersRead * 100 + wordsMastered * 25;
  if (xp >= 600) return { title: "Sage", next: null, xp, nextXp: 600 };
  if (xp >= 300) return { title: "Scribe", next: "Sage", xp, nextXp: 600 };
  if (xp >= 100) return { title: "Scholar", next: "Scribe", xp, nextXp: 300 };
  return { title: "Seeker", next: "Scholar", xp, nextXp: 100 };
}

const LEVEL_COLORS: Record<string, string> = {
  Seeker: "text-parchment/60",
  Scholar: "text-gold",
  Scribe: "text-ember",
  Sage: "#a78bfa", // violet
};

const LEVEL_BG: Record<string, string> = {
  Seeker: "bg-parchment/10",
  Scholar: "bg-gold/20",
  Scribe: "bg-ember/20",
  Sage: "bg-violet-500/20",
};

const PATHWAY_LABELS: Record<string, string> = {
  "wisdom-seeker": "Wisdom Seeker",
  "serious-learner": "Serious Learner",
  "theology-student": "Theology Student",
  "church-leader": "Church Leader",
};

// ── Mock answer history (30 days) ────────────────────────────────────────────

function getMockAnswerDays(): Record<string, string> {
  const days: Record<string, string> = {};
  const answers = [
    "The Spirit hovering suggests active intention — not passive observation.",
    "I think chaos was necessary. Order means nothing without something to overcome.",
    "The Hebrew word bara implies cutting — God carved existence from nothingness.",
    "Every artist faces a blank canvas. This was God's.",
    "Darkness wasn't evil here — it was just unformed. That changes everything.",
    "The waters make me think of birth. Life begins in water.",
    "Hovering is such a tender word for the creator of the universe.",
    "I never noticed tohu wa-bohu before. Formless and void — that's existential.",
  ];
  const today = new Date();
  const answeredDays = [0, 1, 2, 4, 5, 7, 8, 9, 11, 14, 15, 16, 18, 20, 21];
  answeredDays.forEach((offset, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - offset);
    const key = d.toISOString().split("T")[0];
    days[key] = answers[i % answers.length];
  });
  return days;
}

// ── SVG Ring component ───────────────────────────────────────────────────────

function ProgressRing({
  value,
  max,
  size = 80,
  stroke = 6,
  color = "rgb(var(--color-gold))",
}: {
  value: number;
  max: number;
  size?: number;
  stroke?: number;
  color?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const progress = max > 0 ? value / max : 0;
  const offset = circ * (1 - progress);
  return (
    <svg width={size} height={size}>
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={stroke}
      />
      {/* Progress */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}

// ── SVG Constellation map ────────────────────────────────────────────────────

function ConstellationMap({
  chaptersRead,
}: {
  chaptersRead: number[];
  totalChapters: number;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Theme-aware neutral colors (connection lines, locked nodes)
  const mutedLine = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.10)";
  const lockedFill = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const lockedStroke = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.15)";
  const lockedText = isDark ? "rgba(255,255,255,0.20)" : "rgba(0,0,0,0.25)";

  // Node positions for 3 chapters — slight arc layout
  const nodes = [
    { x: 60, y: 120, chapter: 1 },
    { x: 180, y: 60, chapter: 2 },
    { x: 300, y: 110, chapter: 3 },
  ];

  function nodeStatus(ch: number): "completed" | "active" | "locked" {
    if (chaptersRead.includes(ch)) return "completed";
    const maxCompleted = Math.max(0, ...chaptersRead);
    if (ch === maxCompleted + 1 || (chaptersRead.length === 0 && ch === 1)) return "active";
    return "locked";
  }

  return (
    <svg viewBox="0 0 360 180" className="w-full max-w-xs mx-auto">
      {/* Connection lines */}
      {nodes.slice(0, -1).map((node, i) => {
        const next = nodes[i + 1];
        const status = nodeStatus(node.chapter);
        return (
          <line
            key={i}
            x1={node.x}
            y1={node.y}
            x2={next.x}
            y2={next.y}
            stroke={status === "completed" ? "rgba(212,168,83,0.4)" : mutedLine}
            strokeWidth={1.5}
            strokeDasharray={status === "locked" ? "4 4" : "none"}
          />
        );
      })}

      {/* Nodes */}
      {nodes.map((node) => {
        const status = nodeStatus(node.chapter);
        return (
          <g key={node.chapter}>
            {/* Glow for completed */}
            {status === "completed" && (
              <circle cx={node.x} cy={node.y} r={22} fill="rgba(212,168,83,0.15)" />
            )}
            {/* Pulse ring for active */}
            {status === "active" && (
              <circle
                cx={node.x}
                cy={node.y}
                r={20}
                fill="none"
                stroke="rgba(99,102,241,0.4)"
                strokeWidth={1.5}
              >
                <animate attributeName="r" values="18;24;18" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
            {/* Main circle */}
            <circle
              cx={node.x}
              cy={node.y}
              r={16}
              fill={
                status === "completed"
                  ? "rgba(212,168,83,0.25)"
                  : status === "active"
                  ? "rgba(99,102,241,0.25)"
                  : lockedFill
              }
              stroke={
                status === "completed"
                  ? "#D4A853"
                  : status === "active"
                  ? "#6366f1"
                  : lockedStroke
              }
              strokeWidth={1.5}
            />
            {/* Icon */}
            <text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              fontSize="13"
              fill={
                status === "completed"
                  ? "#D4A853"
                  : status === "active"
                  ? "#818cf8"
                  : lockedText
              }
            >
              {status === "completed" ? "✓" : status === "active" ? "◉" : "○"}
            </text>
            {/* Chapter label */}
            <text
              x={node.x}
              y={node.y + 32}
              textAnchor="middle"
              fontSize="9"
              fill={
                status === "completed"
                  ? "rgba(212,168,83,0.8)"
                  : status === "active"
                  ? "rgba(129,140,248,0.8)"
                  : lockedText
              }
              fontFamily="sans-serif"
              letterSpacing="0.05em"
            >
              CH {node.chapter}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const pathway = getPathway();
  const chaptersRead = getCodexRead();
  const conquestDone = getConquestDone();
  const wordsMastered = getWordsMastered();
  const level = getLevel(wordsMastered, chaptersRead.length);
  const answerDays = getMockAnswerDays();

  // Streak: count consecutive answered days ending today
  const streak = (() => {
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split("T")[0];
      if (answerDays[key]) count++;
      else break;
    }
    return count;
  })();

  const totalAnswered = Object.keys(answerDays).length;

  // Calendar: build 30-day grid
  const calendarDays = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const key = d.toISOString().split("T")[0];
    return { key, day: d.getDate(), answered: !!answerDays[key], answer: answerDays[key] };
  });

  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-ink text-parchment pb-12">

      {/* ── Profile header ── */}
      <div className="border-b border-parchment/10 px-6 py-10">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center sm:items-start gap-6">

          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full bg-slate/40 border border-gold/30 flex items-center justify-center text-3xl font-serif text-gold">
              {user?.email?.charAt(0).toUpperCase() ?? "?"}
            </div>
            {/* Level badge */}
            <div
              className={`absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-xs font-semibold ${LEVEL_BG[level.title]}`}
              style={{ color: level.title === "Sage" ? LEVEL_COLORS.Sage : undefined }}
            >
              <span className={level.title !== "Sage" ? LEVEL_COLORS[level.title] : ""}>
                {level.title}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <p className="text-parchment font-serif text-xl mb-1">
              {user?.email?.split("@")[0] ?? "Anonymous"}
            </p>
            <p className="text-parchment/40 text-sm mb-3">{user?.email}</p>

            {/* Pathway badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs mb-4">
              ✦ {PATHWAY_LABELS[pathway] ?? pathway}
            </div>

            {/* XP progress bar */}
            {level.next && (
              <div className="mt-1">
                <div className="flex justify-between text-xs text-parchment/30 mb-1.5">
                  <span>{level.xp} XP</span>
                  <span>{level.nextXp} XP → {level.next}</span>
                </div>
                <div className="h-1.5 bg-parchment/10 rounded-full overflow-hidden max-w-xs">
                  <div
                    className="h-full bg-gold rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, (level.xp / level.nextXp) * 100)}%` }}
                  />
                </div>
              </div>
            )}
            {!level.next && (
              <p className="text-xs text-violet-400/70 mt-1">Maximum level reached ✦</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="border-b border-parchment/10 px-6 py-6">
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-4">

          {/* Streak */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <span className="text-2xl">🔥</span>
              <span className="text-2xl font-serif font-bold text-parchment">{streak}</span>
            </div>
            <p className="text-parchment/30 text-xs uppercase tracking-widest">Day Streak</p>
          </div>

          {/* Hebrew words mastered — ring */}
          <div className="text-center flex flex-col items-center">
            <div className="relative w-16 h-16 flex items-center justify-center mb-1">
              <div className="absolute inset-0">
                <ProgressRing value={wordsMastered} max={TOTAL_WORDS} size={64} stroke={5} />
              </div>
              <div className="text-center z-10">
                <p className="text-sm font-serif font-bold text-gold leading-none">{wordsMastered}</p>
                <p className="text-parchment/30 text-[9px]">/{TOTAL_WORDS}</p>
              </div>
            </div>
            <p className="text-parchment/30 text-xs uppercase tracking-widest">Hebrew Words</p>
          </div>

          {/* Total answers */}
          <div className="text-center">
            <p className="text-2xl font-serif font-bold text-parchment mb-1">{totalAnswered}</p>
            <p className="text-parchment/30 text-xs uppercase tracking-widest">Answers</p>
          </div>
        </div>
      </div>

      {/* ── Genesis progress constellation ── */}
      <div className="border-b border-parchment/10 px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-parchment/30 text-xs uppercase tracking-widest mb-1">
                Genesis Progress
              </p>
              <p className="text-parchment/60 text-sm">
                {chaptersRead.length} of {TOTAL_CHAPTERS} chapters read
              </p>
            </div>
            <div className="text-right">
              <p className="text-parchment/30 text-xs uppercase tracking-widest mb-1">Conquest</p>
              <p className="text-parchment/60 text-sm">
                {conquestDone.length} of {TOTAL_CHAPTERS} complete
              </p>
            </div>
          </div>

          <ConstellationMap chaptersRead={chaptersRead} totalChapters={TOTAL_CHAPTERS} />

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-gold/60" />
              <span className="text-parchment/30 text-xs">Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-400/60" />
              <span className="text-parchment/30 text-xs">Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-parchment/10" />
              <span className="text-parchment/30 text-xs">Locked</span>
            </div>
          </div>

          {/* Chapter status chips */}
          <div className="flex gap-3 justify-center mt-5 flex-wrap">
            {Array.from({ length: TOTAL_CHAPTERS }, (_, i) => i + 1).map((ch) => {
              const read = chaptersRead.includes(ch);
              const conquered = conquestDone.includes(ch);
              return (
                <div
                  key={ch}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs ${
                    read && conquered
                      ? "border-gold/30 bg-gold/10 text-gold/70"
                      : read
                      ? "border-indigo-400/30 bg-indigo-400/10 text-indigo-300/70"
                      : "border-parchment/10 text-parchment/30"
                  }`}
                >
                  <span>{read && conquered ? "⚔️" : read ? "📖" : "🔒"}</span>
                  <span>Chapter {ch}</span>
                  {read && !conquered && (
                    <span className="text-indigo-300/50 text-[10px]">conquest pending</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 30-day answer calendar ── */}
      <div className="border-b border-parchment/10 px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-parchment/30 text-xs uppercase tracking-widest mb-5">
            30-Day Answer Journal
          </p>
          <div className="grid grid-cols-10 gap-1.5">
            {calendarDays.map((d) => (
              <button
                key={d.key}
                onClick={() => setSelectedDay(selectedDay === d.key ? null : d.key)}
                title={d.answered ? `Day ${d.day}: answered` : `Day ${d.day}: no answer`}
                className={`aspect-square rounded-md flex items-center justify-center text-xs transition-all ${
                  d.answered
                    ? selectedDay === d.key
                      ? "bg-gold text-ink font-bold scale-110"
                      : "bg-gold/30 text-gold hover:bg-gold/50"
                    : "bg-parchment/5 text-parchment/20 hover:bg-parchment/10"
                }`}
              >
                {d.day}
              </button>
            ))}
          </div>

          {/* Selected day answer */}
          {selectedDay && answerDays[selectedDay] && (
            <div className="mt-4 border border-gold/20 rounded-xl p-4 bg-gold/5">
              <p className="text-gold/60 text-xs uppercase tracking-widest mb-2">
                {new Date(selectedDay + "T00:00:00").toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-parchment/70 text-sm leading-relaxed italic">
                "{answerDays[selectedDay]}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Recent answers (last 3) ── */}
      <div className="border-b border-parchment/10 px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-parchment/30 text-xs uppercase tracking-widest mb-5">
            Recent Reflections
          </p>
          <div className="space-y-3">
            {mockAnswers.slice(0, 3).map((ans) => (
              <div
                key={ans.id}
                className="border border-parchment/10 rounded-xl p-4 bg-slate/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gold/60 text-xs">
                    {mockQuestions[0]?.text?.slice(0, 50)}...
                  </span>
                  <span className="text-parchment/20 text-xs">{ans.timeAgo}</span>
                </div>
                <p className="text-parchment/60 text-sm leading-relaxed line-clamp-2">
                  {ans.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick actions ── */}
      <div className="px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-3">
          <button
            onClick={() => navigate("/codex")}
            className="w-full flex items-center justify-between px-5 py-3.5 border border-parchment/10 rounded-xl hover:border-parchment/30 transition-all text-sm text-parchment/60 hover:text-parchment"
          >
            <span className="flex items-center gap-3">
              <span>📜</span> Continue in the Codex
            </span>
            <span className="text-parchment/30">→</span>
          </button>
          <button
            onClick={() => navigate("/question")}
            className="w-full flex items-center justify-between px-5 py-3.5 border border-parchment/10 rounded-xl hover:border-parchment/30 transition-all text-sm text-parchment/60 hover:text-parchment"
          >
            <span className="flex items-center gap-3">
              <span>✦</span> Today's Question
            </span>
            <span className="text-parchment/30">→</span>
          </button>

          <button
            onClick={handleSignOut}
            className="w-full py-3.5 text-parchment/30 text-sm hover:text-ember transition-colors border border-dashed border-parchment/10 rounded-xl mt-6"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}