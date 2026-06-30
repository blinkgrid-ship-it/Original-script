import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { fetchProfile, type ApiProfile } from "../lib/api";

const TOTAL_CHAPTERS = 3;
const TOTAL_WORDS = 11;

const LEVEL_COLORS: Record<string, string> = {
  Seeker: "text-parchment/60",
  Scholar: "text-gold",
  Scribe: "text-ember",
  Sage: "text-violet-400",
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

// ── SVG Constellation (read-only) ────────────────────────────────────────────

function ConstellationReadOnly({ chaptersRead }: { chaptersRead: number[] }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const mutedLine = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.10)";
  const lockedFill = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const lockedStroke = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.15)";
  const lockedText = isDark ? "rgba(255,255,255,0.20)" : "rgba(0,0,0,0.25)";

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
      {nodes.slice(0, -1).map((node, i) => {
        const next = nodes[i + 1];
        const status = nodeStatus(node.chapter);
        return (
          <line
            key={i}
            x1={node.x} y1={node.y} x2={next.x} y2={next.y}
            stroke={status === "completed" ? "rgba(212,168,83,0.4)" : mutedLine}
            strokeWidth={1.5}
            strokeDasharray={status === "locked" ? "4 4" : "none"}
          />
        );
      })}
      {nodes.map((node) => {
        const status = nodeStatus(node.chapter);
        return (
          <g key={node.chapter}>
            {status === "completed" && (
              <circle cx={node.x} cy={node.y} r={22} fill="rgba(212,168,83,0.15)" />
            )}
            {status === "active" && (
              <circle cx={node.x} cy={node.y} r={20} fill="none" stroke="rgba(99,102,241,0.4)" strokeWidth={1.5}>
                <animate attributeName="r" values="18;24;18" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
            <circle
              cx={node.x} cy={node.y} r={16}
              fill={status === "completed" ? "rgba(212,168,83,0.25)" : status === "active" ? "rgba(99,102,241,0.25)" : lockedFill}
              stroke={status === "completed" ? "#D4A853" : status === "active" ? "#6366f1" : lockedStroke}
              strokeWidth={1.5}
            />
            <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="13"
              fill={status === "completed" ? "#D4A853" : status === "active" ? "#818cf8" : lockedText}>
              {status === "completed" ? "✓" : status === "active" ? "◉" : "○"}
            </text>
            <text x={node.x} y={node.y + 32} textAnchor="middle" fontSize="9"
              fill={status === "completed" ? "rgba(212,168,83,0.8)" : status === "active" ? "rgba(129,140,248,0.8)" : lockedText}
              fontFamily="sans-serif" letterSpacing="0.05em">
              CH {node.chapter}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── SVG Progress ring ────────────────────────────────────────────────────────

function ProgressRing({ value, max, size = 64, stroke = 5 }: { value: number; max: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - (max > 0 ? value / max : 0));
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(var(--color-gold))"
        strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.6s ease" }} />
    </svg>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function PublicProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState<ApiProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isOwnProfile = !!user && userId === user.id;

  // Fetch the public profile from the backend (same shape for own + others).
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        setProfile(await fetchProfile(userId));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Profile not found.");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ink text-parchment flex items-center justify-center">
        <p className="text-parchment/40 text-sm">Loading profile…</p>
      </div>
    );
  }
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-ink text-parchment flex flex-col items-center justify-center gap-4 px-5">
        <p className="text-parchment/50 text-sm">{error ?? "Profile not found."}</p>
        <button onClick={() => navigate(-1)} className="text-gold/70 text-sm hover:text-gold">← Back</button>
      </div>
    );
  }

  const wordsMastered = profile.wordsMastered;

  return (
    <div className="min-h-screen bg-ink text-parchment pb-12">

      {/* ── Back bar ── */}
      <div className="sticky top-0 z-10 bg-ink/95 backdrop-blur-sm border-b border-parchment/10 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-parchment/50 hover:text-parchment transition-colors text-sm"
        >
          ← Back
        </button>
        <span className="text-parchment/20 text-xs">·</span>
        <span className="text-parchment/50 text-xs uppercase tracking-widest">Community Profile</span>
        {isOwnProfile && (
          <span className="ml-auto text-gold/50 text-xs border border-gold/20 rounded px-2 py-0.5">
            Your profile
          </span>
        )}
      </div>

      {/* ── Profile header ── */}
      <div className="border-b border-parchment/10 px-6 py-10">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center sm:items-start gap-6">

          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full bg-slate/40 border border-gold/30 flex items-center justify-center text-3xl font-serif text-gold">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className={`absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-xs font-semibold ${LEVEL_BG[profile.level]}`}>
              <span className={LEVEL_COLORS[profile.level]}>{profile.level}</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-parchment font-serif text-2xl mb-1">{profile.name}</h1>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs mb-4">
              ✦ {PATHWAY_LABELS[profile.pathway ?? ""] ?? profile.pathway ?? "Seeker"}
            </div>

            {/* XP bar */}
            <div className="mt-1 max-w-xs">
              <div className="flex justify-between text-xs text-parchment/30 mb-1.5">
                <span>{profile.xp} XP</span>
                <span className={LEVEL_COLORS[profile.level]}>{profile.level}</span>
              </div>
              <div className="h-1.5 bg-parchment/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, (profile.xp / 600) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="border-b border-parchment/10 px-6 py-6">
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <span className="text-2xl">🔥</span>
              <span className="text-2xl font-serif font-bold text-parchment">{profile.streak}</span>
            </div>
            <p className="text-parchment/30 text-xs uppercase tracking-widest">Day Streak</p>
          </div>
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
          <div className="text-center">
            <p className="text-2xl font-serif font-bold text-parchment mb-1">{profile.totalAnswers}</p>
            <p className="text-parchment/30 text-xs uppercase tracking-widest">Answers</p>
          </div>
        </div>
      </div>

      {/* ── Genesis constellation ── */}
      <div className="border-b border-parchment/10 px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-parchment/30 text-xs uppercase tracking-widest mb-1">Genesis Progress</p>
              <p className="text-parchment/60 text-sm">
                {profile.chaptersRead.length} of {TOTAL_CHAPTERS} chapters read
              </p>
            </div>
            <div className="text-right">
              <p className="text-parchment/30 text-xs uppercase tracking-widest mb-1">Conquest</p>
              <p className="text-parchment/60 text-sm">
                {profile.conquestDone.length} of {TOTAL_CHAPTERS} complete
              </p>
            </div>
          </div>
          <ConstellationReadOnly chaptersRead={profile.chaptersRead} />
        </div>
      </div>

      {/* ── Recent reflections ── */}
      {profile.recentAnswers.length > 0 && (
        <div className="px-6 py-8">
          <div className="max-w-2xl mx-auto">
            <p className="text-parchment/30 text-xs uppercase tracking-widest mb-5">
              Recent Reflections
            </p>
            <div className="space-y-4">
              {profile.recentAnswers.map((item, i) => (
                <div key={i} className="border border-parchment/10 rounded-xl p-5 bg-slate/10">
                  <p className="text-gold/60 text-xs mb-2 leading-snug">{item.question}</p>
                  <p className="text-parchment/70 text-sm leading-relaxed italic">
                    "{item.answer}"
                  </p>
                  <p className="text-parchment/20 text-xs mt-3">
                    {new Date(item.date + "T00:00:00").toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}