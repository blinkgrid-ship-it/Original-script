import { useNavigate } from "react-router-dom";

const LEVEL_COLORS: Record<string, string> = {
  Seeker: "text-parchment/50",
  Scholar: "text-gold/80",
  Scribe: "text-ember/80",
  Sage: "text-violet-400/80",
};

const PATHWAY_LABELS: Record<string, string> = {
  "wisdom-seeker": "Wisdom Seeker",
  "serious-learner": "Serious Learner",
  "theology-student": "Theology Student",
  "church-leader": "Church Leader",
};

// Avatar background colours cycling by name
const AVATAR_COLORS = [
  "bg-gold/20 text-gold",
  "bg-indigo-400/20 text-indigo-300",
  "bg-ember/20 text-ember",
  "bg-violet-400/20 text-violet-300",
];

function avatarColor(name: string): string {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

interface ProfileCardProps {
  userId: string;
  name: string;
  pathway: string;
  level: string;
  /** If true, renders as a compact inline chip; if false (default), renders as a full card row */
  compact?: boolean;
}

export default function ProfileCard({
  userId,
  name,
  pathway,
  level,
  compact = false,
}: ProfileCardProps) {
  const navigate = useNavigate();

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation(); // don't trigger parent card clicks
    navigate(`/community/${userId}`);
  }

  if (compact) {
    // Inline chip used inside answer cards
    return (
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-2 group py-1.5 -my-1.5 min-h-11"
        title={`View ${name}'s profile`}
      >
        {/* Avatar */}
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${avatarColor(name)}`}>
          {name.charAt(0).toUpperCase()}
        </div>

        {/* Name + level */}
        <div className="text-left">
          <span className="text-parchment/80 text-sm font-medium group-hover:text-gold transition-colors">
            {name}
          </span>
          <span className={`ml-1.5 text-xs ${LEVEL_COLORS[level]}`}>· {level}</span>
        </div>
      </button>
    );
  }

  // Full card row (used in standalone lists if needed)
  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center gap-3 border border-parchment/10 rounded-xl p-4 bg-slate/10 hover:border-gold/30 transition-all text-left group"
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shrink-0 ${avatarColor(name)}`}>
        {name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-parchment/80 text-sm font-medium group-hover:text-gold transition-colors truncate">
          {name}
        </p>
        <p className="text-parchment/30 text-xs truncate">
          ✦ {PATHWAY_LABELS[pathway] ?? pathway}
        </p>
      </div>
      <div className={`text-xs font-semibold shrink-0 ${LEVEL_COLORS[level]}`}>
        {level}
      </div>
      <span className="text-parchment/20 text-xs">→</span>
    </button>
  );
}