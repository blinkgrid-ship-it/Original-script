import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getChapterWords } from "../data/conquestData";

// ── Particle burst + XP float animation ──────────────────────────────────────

// 12 particles spread evenly around a full circle
const PARTICLE_ANGLES = Array.from({ length: 12 }, (_, i) => (i / 12) * 2 * Math.PI);
const PARTICLE_COLORS = [
  "#D4A853", "#E8C97A", "#D4A853", "#F5F0E8",
  "#D4A853", "#E8C97A", "#D4A853", "#F5F0E8",
  "#D4A853", "#E8C97A", "#D4A853", "#F5F0E8",
];

function MasteredAnimation({ xp }: { xp: number }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {/* Particles */}
      {PARTICLE_ANGLES.map((angle, i) => {
        const distance = 80 + Math.random() * 40;
        const tx = `${Math.cos(angle) * distance}px`;
        const ty = `${Math.sin(angle) * distance}px`;
        const delay = `${i * 20}ms`;
        const size = 6 + (i % 3) * 3;

        return (
          <div
            key={i}
            className="absolute rounded-full animate-particle"
            style={{
              width: size,
              height: size,
              backgroundColor: PARTICLE_COLORS[i],
              "--tx": tx,
              "--ty": ty,
              animationDelay: delay,
              top: "50%",
              left: "50%",
              marginTop: -size / 2,
              marginLeft: -size / 2,
            } as React.CSSProperties}
          />
        );
      })}

      {/* +XP floating badge */}
      <div
        className="absolute animate-xp-float select-none"
        style={{ top: "42%", left: "50%", transform: "translateX(-50%)" }}
      >
        <div className="px-4 py-2 rounded-full bg-gold text-ink font-bold text-lg shadow-lg">
          +{xp} XP
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ConquestPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const chapterNumber = Number(searchParams.get("chapter") ?? "1");

  const conquestChapter = getChapterWords(chapterNumber);
  const words = conquestChapter?.words ?? [];

  const [mastered, setMastered] = useState<Set<number>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [screen, setScreen] = useState<"study" | "complete">("study");
  const [showAnimation, setShowAnimation] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const currentWord = words[currentIndex];

  function toggleSection(key: string) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function handleMasterWord() {
    if (!currentWord || showAnimation) return;

    setShowAnimation(true);

    setTimeout(() => { setIsExiting(true); }, 500);

    setTimeout(() => {
      setShowAnimation(false);
      setIsExiting(false);
      setOpenSections(new Set());

      const next = new Set(mastered);
      next.add(currentIndex);
      setMastered(next);

      if (next.size >= words.length) {
        const conquestDone: number[] = JSON.parse(
          localStorage.getItem("os_conquest_done") ?? "[]"
        );
        if (!conquestDone.includes(chapterNumber)) {
          localStorage.setItem(
            "os_conquest_done",
            JSON.stringify([...conquestDone, chapterNumber])
          );
        }
        setScreen("complete");
      } else {
        let next_index = (currentIndex + 1) % words.length;
        while (next.has(next_index)) {
          next_index = (next_index + 1) % words.length;
        }
        setCurrentIndex(next_index);
      }
    }, 850);
  }

  const wordXp = currentWord?.xp ?? 25;

  // ── Complete screen ──────────────────────────────────────────────────────────

  if (screen === "complete") {
    return (
      <div className="min-h-screen bg-ink text-parchment flex flex-col items-center justify-center px-6 pb-8 text-center">
        <div className="w-20 h-20 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-4xl mb-6">
          ⚔️
        </div>
        <h1 className="text-3xl font-serif text-parchment mb-3">
          Chapter {chapterNumber} Conquered!
        </h1>
        <p className="text-parchment/50 text-base leading-relaxed max-w-sm mb-2">
          You've mastered all {words.length} Hebrew words from Chapter {chapterNumber}.
        </p>
        <p className="text-gold/70 text-sm mb-10">
          +{words.reduce((sum, w) => sum + (w.xp ?? 25), 0)} XP earned
        </p>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={() => navigate("/codex")}
            className="py-4 bg-gold text-ink font-semibold rounded-xl hover:bg-gold-light transition-all text-sm uppercase tracking-wide"
          >
            Back to Codex →
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="py-3.5 border border-parchment/15 text-parchment/60 rounded-xl hover:border-parchment/30 text-sm transition-all"
          >
            View My Progress
          </button>
        </div>
      </div>
    );
  }

  // ── No words found ───────────────────────────────────────────────────────────

  if (!currentWord) {
    return (
      <div className="min-h-screen bg-ink text-parchment flex items-center justify-center px-6 text-center">
        <div>
          <p className="text-parchment/50 mb-4">No conquest words found for Chapter {chapterNumber}.</p>
          <button onClick={() => navigate("/codex")} className="text-gold text-sm hover:underline inline-block py-2.5">
            ← Back to Codex
          </button>
        </div>
      </div>
    );
  }

  // ── Word study screen ────────────────────────────────────────────────────────

  const progress = mastered.size / words.length;

  const bibleUsageText =
    currentWord.bibleUsages && currentWord.bibleUsages.length > 0
      ? currentWord.bibleUsages
          .map((u: { reference: string; text: string }) => `${u.reference} — "${u.text}"`)
          .join("\n\n")
      : `The word "${currentWord.transliteration}" carries deep resonance throughout the Hebrew Bible, appearing in pivotal moments of creation, covenant, and transformation.`;

  const sections = [
    {
      key: "root",
      label: "Root & Family",
      content: currentWord.root
        ? `Root: ${currentWord.root}${currentWord.secondaryMeaning ? ` · ${currentWord.secondaryMeaning}` : ""}`
        : currentWord.primaryMeaning,
    },
    {
      key: "meaning",
      label: "Primary Meaning",
      content: currentWord.primaryMeaning,
    },
    {
      key: "usage",
      label: "How It Appears in This Chapter",
      content: currentWord.genesisContext,
    },
    {
      key: "scripture",
      label: "Where Else It Appears in Scripture",
      content: bibleUsageText,
    },
  ];

  return (
    <div className="min-h-screen bg-ink text-parchment pb-8">

      {/* Animation overlay */}
      {showAnimation && <MasteredAnimation xp={wordXp} />}

      {/* ── Header ── */}
      <div className="border-b border-parchment/10 px-5 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/codex")}
          className="text-parchment/40 hover:text-parchment text-sm transition-colors py-2.5 -my-2.5"
        >
          ← Codex
        </button>
        <div className="text-center">
          <p className="text-parchment/50 text-xs uppercase tracking-widest">
            Conquest · Chapter {chapterNumber}
          </p>
        </div>
        <p className="text-parchment/40 text-xs">
          {mastered.size}/{words.length}
        </p>
      </div>

      {/* ── Progress bar ── */}
      <div className="h-1 bg-parchment/10">
        <div
          className="h-full bg-gold transition-all duration-500"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* ── Word card ── */}
      <div
        className={`max-w-xl mx-auto px-5 pt-12 pb-6 transition-opacity duration-300 ${
          isExiting ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
        style={{ transition: "opacity 0.3s ease, transform 0.3s ease" }}
      >
        {/* Hebrew word — large and centered */}
        <div className="text-center mb-10">
          <p
            className="text-gold font-hebrew mb-3 leading-none"
            dir="rtl"
            style={{
              fontFamily: "'Frank Ruhl Libre', serif",
              fontSize: "clamp(60px, 15vw, 96px)",
            }}
          >
            {currentWord.hebrew}
          </p>
          <p className="text-parchment/50 text-lg italic tracking-wide">
            {currentWord.transliteration}
          </p>

          {/* Word progress dots */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {words.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  mastered.has(i)
                    ? "w-2.5 h-2.5 bg-gold"
                    : i === currentIndex
                    ? "w-3 h-3 border-2 border-gold bg-gold/20"
                    : "w-2 h-2 bg-parchment/15"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── 4 accordion sections ── */}
        <div className="space-y-2 mb-10">
          {sections.map((sec) => {
            const isOpen = openSections.has(sec.key);
            return (
              <div
                key={sec.key}
                className="border border-parchment/10 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(sec.key)}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-parchment/5 transition-colors"
                >
                  <span className="text-parchment/70 text-sm font-medium">{sec.label}</span>
                  <span className="text-parchment/30 text-lg">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 border-t border-parchment/10">
                    <p className="text-parchment/60 text-sm leading-relaxed pt-3">
                      {sec.content}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Mark as Mastered button ── */}
        <button
          onClick={handleMasterWord}
          disabled={showAnimation}
          className="w-full py-4 bg-gold text-ink font-bold rounded-xl hover:bg-gold-light active:scale-95 disabled:opacity-70 transition-all text-sm uppercase tracking-widest"
        >
          {showAnimation ? "✓ Mastered!" : "Mark as Mastered"}
        </button>

        <p className="text-center text-parchment/20 text-xs mt-3">
          +{wordXp} XP · {words.length - mastered.size} word{words.length - mastered.size !== 1 ? "s" : ""} remaining
        </p>
      </div>
    </div>
  );
}