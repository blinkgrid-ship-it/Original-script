import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { genesis } from "../data/codexData";
import AuthModal from "../component/AuthModal";
function getConquestDone(): number[] {
  return JSON.parse(localStorage.getItem("os_conquest_done") ?? "[]");
}

function getCodexRead(): number[] {
  return JSON.parse(localStorage.getItem("os_codex_read") ?? "[]");
}

export default function CodexPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [completed, setCompleted] = useState<number[]>(getCodexRead);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [language, setLanguage] = useState<"english" | "malayalam" | "hebrew">("english");
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [openExplanations, setOpenExplanations] = useState<Set<string>>(new Set());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authContext, setAuthContext] = useState<string | null>(null);
  const [conquestGate, setConquestGate] = useState<number | null>(null);
  const [chapterComplete, setChapterComplete] = useState(false);

  const chapter = genesis[currentChapter];

  // ── Lock logic ──────────────────────────────────────────────────────────────

  function isChapterLocked(index: number): boolean {
    if (index === 0) return false;
    if (!user) return true;
    const conquestDone = getConquestDone();
    if (index === 1) return !conquestDone.includes(1);
    if (index === 2) return !conquestDone.includes(2);
    return true;
  }

  type LockState =
    | "free"
    | "need-conquest-and-login"
    | "need-login-conquest-done"
    | "need-conquest"
    | "unlocked";

  function getLockState(index: number): LockState {
    if (index === 0) return "free";
    const conquestDone = getConquestDone();
    const prevConquestDone = conquestDone.includes(index);
    if (!user && !prevConquestDone) return "need-conquest-and-login";
    if (!user && prevConquestDone) return "need-login-conquest-done";
    if (user && !prevConquestDone) return "need-conquest";
    return "unlocked";
  }

  function lockLabel(index: number): { icon: string; text: string; highlight?: boolean } {
    const state = getLockState(index);
    switch (state) {
      case "free":
        return { icon: "✦", text: "Free Access" };
      case "need-conquest-and-login":
        return { icon: "🔒", text: "Complete Ch" + index + " Conquest & Sign In" };
      case "need-login-conquest-done":
        return { icon: "✓", text: "Conquest done · Sign In to read", highlight: true };
      case "need-conquest":
        return { icon: "⚔️", text: "Complete Ch" + index + " Conquest first" };
      case "unlocked":
        return { icon: "✦", text: "Unlocked" };
    }
  }

  // ── Chapter click ────────────────────────────────────────────────────────────

  function handleChapterClick(index: number) {
    if (index === 0) {
      setCurrentChapter(0);
      setChapterComplete(false);
      return;
    }
    const state = getLockState(index);
    if (state === "need-login-conquest-done") {
      setAuthContext(
        `You've already completed the Chapter ${index} Conquest! Sign in to unlock Chapter ${index + 1}.`
      );
      setShowAuthModal(true);
      return;
    }
    if (state === "need-conquest-and-login") {
      setAuthContext(null);
      setShowAuthModal(true);
      return;
    }
    if (state === "need-conquest") {
      setConquestGate(index);
      return;
    }
    // unlocked
    setCurrentChapter(index);
    setConquestGate(null);
    setChapterComplete(false);
  }

  // ── Chapter complete ──────────────────────────────────────────────────────────

  function markComplete() {
    const chNum = chapter.number;
    const existing = getCodexRead();
    if (!existing.includes(chNum)) {
      const updated = [...existing, chNum];
      localStorage.setItem("os_codex_read", JSON.stringify(updated));
      setCompleted(updated);
    }
    setChapterComplete(true);
  }

  // What to show after reading a chapter
  function chapterCompleteNextStep(): {
    heading: string;
    body: string;
    cta: string;
    action: () => void;
    secondaryCta?: string;
    secondaryAction?: () => void;
  } {
    const conquestDone = getConquestDone();
    const chNum = chapter.number;
    const nextIndex = currentChapter + 1;

    if (nextIndex >= genesis.length) {
      return {
        heading: "You've completed all chapters!",
        body: "More chapters coming soon. Keep revisiting and deepening your understanding.",
        cta: "Back to Chapter 1",
        action: () => { setCurrentChapter(0); setChapterComplete(false); },
      };
    }

    if (!conquestDone.includes(chNum)) {
      // Conquest not done yet — primary action is to do conquest
      return {
        heading: `Chapter ${chNum} Read!`,
        body: `Complete the Conquest Challenge to test what you learned — and unlock Chapter ${chNum + 1}.`,
        cta: "Enter Conquest Mode →",
        action: () => navigate(`/conquest?chapter=${chNum}`),
        secondaryCta: "Back to chapter list",
        secondaryAction: () => setChapterComplete(false),
      };
    }

    if (!user) {
      // Conquest done but not logged in
      return {
        heading: `Chapter ${chNum} Complete!`,
        body: `You've already finished the Conquest Challenge for this chapter. Sign in to unlock Chapter ${chNum + 1}.`,
        cta: "Sign In to Continue →",
        action: () => {
          setChapterComplete(false);
          setAuthContext(`Sign in to unlock Chapter ${chNum + 1}. You've already completed the Conquest!`);
          setShowAuthModal(true);
        },
        secondaryCta: "Back to chapter list",
        secondaryAction: () => setChapterComplete(false),
      };
    }

    // Logged in + conquest done → next chapter is unlocked
    return {
      heading: `Chapter ${chNum} Complete!`,
      body: `Chapter ${chNum + 1} is now unlocked.`,
      cta: `Read Chapter ${chNum + 1} →`,
      action: () => {
        setCurrentChapter(nextIndex);
        setChapterComplete(false);
      },
    };
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────

  function toggleExplanation(key: string) {
    setOpenExplanations((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-ink text-parchment flex">

      {/* ── Chapter sidebar ── */}
      <aside className="hidden md:flex flex-col w-64 border-r border-parchment/10 pt-6 pb-10 px-4 shrink-0">
        <p className="text-parchment/30 text-xs uppercase tracking-widest mb-5 px-2">Genesis</p>
        <div className="space-y-2">
          {genesis.map((ch, i) => {
            const locked = isChapterLocked(i);
            const label = lockLabel(i);
            const isActive = currentChapter === i && !chapterComplete;
            const isRead = completed.includes(ch.number);

            return (
              <button
                key={ch.number}
                onClick={() => handleChapterClick(i)}
                className={`w-full text-left rounded-xl px-3 py-3 transition-all border ${
                  isActive
                    ? "border-gold/40 bg-gold/10"
                    : locked
                    ? "border-parchment/5 opacity-60 hover:opacity-80"
                    : "border-parchment/10 hover:border-parchment/30"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{locked ? "🔒" : isRead ? "✓" : "📖"}</span>
                  <span
                    className={`text-sm font-medium ${
                      isActive ? "text-gold" : locked ? "text-parchment/40" : "text-parchment/80"
                    }`}
                  >
                    Chapter {ch.number}
                  </span>
                </div>
                <p className="text-parchment/30 text-xs pl-7 leading-tight mb-1.5">Genesis</p>
                {/* Lock state label */}
                <p
                  className={`text-xs pl-7 leading-tight font-medium ${
                    label.highlight ? "text-gold/70" : locked ? "text-ember/60" : "text-parchment/20"
                  }`}
                >
                  {label.icon} {label.text}
                </p>
              </button>
            );
          })}
        </div>

        {/* Language toggle */}
        <div className="mt-auto pt-6 border-t border-parchment/10">
          <p className="text-parchment/30 text-xs uppercase tracking-widest mb-3">Language</p>
          <div className="flex flex-col gap-1">
            {(["english", "malayalam", "hebrew"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-2 rounded-lg text-xs capitalize text-left transition-all ${
                  language === lang
                    ? "bg-gold/20 text-gold"
                    : "text-parchment/40 hover:text-parchment/70"
                }`}
              >
                {lang === "english" ? "English" : lang === "malayalam" ? "മലയാളം" : "עברית"}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto pb-12">

        {/* Mobile chapter tabs */}
        <div className="md:hidden flex border-b border-parchment/10 overflow-x-auto">
          {genesis.map((ch, i) => {
            const locked = isChapterLocked(i);
            const label = lockLabel(i);
            return (
              <button
                key={ch.number}
                onClick={() => handleChapterClick(i)}
                className={`flex-1 min-w-[100px] py-3 px-3 text-center border-b-2 transition-all ${
                  currentChapter === i && !chapterComplete
                    ? "border-gold text-gold"
                    : "border-transparent text-parchment/40"
                }`}
              >
                <p className="text-xs font-medium">{locked ? "🔒" : "📖"} Ch{ch.number}</p>
                {label.highlight && (
                  <p className="text-gold/60 text-[10px] mt-0.5">✓ Conquest done</p>
                )}
                {locked && !label.highlight && (
                  <p className="text-ember/50 text-[10px] mt-0.5 leading-tight">{label.text}</p>
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile language toggle */}
        <div className="md:hidden flex gap-2 px-4 py-3 border-b border-parchment/10">
          {(["english", "malayalam", "hebrew"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                language === lang
                  ? "bg-gold/20 text-gold"
                  : "text-parchment/40 border border-parchment/10 hover:border-parchment/30"
              }`}
            >
              {lang === "english" ? "English" : lang === "malayalam" ? "ML" : "עב"}
            </button>
          ))}
        </div>

        {/* ── Chapter complete screen ── */}
        {chapterComplete ? (
          <div className="max-w-2xl mx-auto px-6 pt-16 text-center">
            <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center text-4xl mx-auto mb-6">
              ✓
            </div>
            {(() => {
              const step = chapterCompleteNextStep();
              return (
                <>
                  <h2 className="text-3xl font-serif text-parchment mb-3">{step.heading}</h2>
                  <p className="text-parchment/50 text-base leading-relaxed max-w-md mx-auto mb-8">
                    {step.body}
                  </p>
                  <button
                    onClick={step.action}
                    className="w-full max-w-xs mx-auto block px-8 py-4 bg-gold text-ink font-semibold rounded-xl hover:bg-gold-light transition-all text-sm uppercase tracking-wide mb-3"
                  >
                    {step.cta}
                  </button>
                  {step.secondaryCta && (
                    <button
                      onClick={step.secondaryAction}
                      className="text-parchment/30 text-sm hover:text-parchment transition-colors"
                    >
                      {step.secondaryCta}
                    </button>
                  )}
                </>
              );
            })()}
          </div>
        ) : (
          <>
            {/* Chapter header */}
            <div className="border-b border-parchment/10 px-6 py-8">
              <p className="text-parchment/30 text-xs uppercase tracking-widest mb-2">
                Genesis · Chapter {chapter.number}
              </p>
              <h1 className="text-3xl font-serif text-parchment mb-2">
                Chapter {chapter.number}
              </h1>
            </div>

            {/* Verses */}
            <div className="px-6 py-8 max-w-3xl space-y-6">
              {/* Deep OSR reader entry */}
              <button
                onClick={() => navigate(`/codex/genesis/${chapter.number}/1`)}
                className="w-full flex items-center justify-between gap-4 text-left rounded-xl px-5 py-4 border border-gold/20 bg-gold/5 hover:border-gold/50 hover:bg-gold/10 transition-all group"
              >
                <div>
                  <p className="text-gold/70 text-xs uppercase tracking-widest mb-1">✦ Deep Read</p>
                  <p className="text-parchment font-serif text-base group-hover:text-gold transition-colors">
                    Read Genesis {chapter.number} verse-by-verse
                  </p>
                  <p className="text-parchment/40 text-xs mt-1">
                    Source layer, cinematic scene, word study &amp; scholar's conclusion.
                  </p>
                </div>
                <span className="text-gold/50 group-hover:text-gold text-xl shrink-0 transition-colors">→</span>
              </button>

              {chapter.verses.map((verse) => {
                const key = `${chapter.number}-${verse.number}`;
                const isExpOpen = openExplanations.has(key);

                return (
                  <div
                    key={verse.number}
                    className="border border-parchment/10 rounded-2xl overflow-hidden"
                  >
                    {/* Verse header */}
                    <div className="px-5 py-3 bg-slate/20 border-b border-parchment/10">
                      <span className="text-parchment/40 text-xs uppercase tracking-widest">
                        Verse {verse.number}
                      </span>
                    </div>

                    {/* Verse text */}
                    <div className="px-5 py-5">
                      {language === "english" && (
                        <p className="text-parchment text-base leading-relaxed">{verse.english}</p>
                      )}
                      {language === "malayalam" && (
                        <p className="text-parchment text-base leading-relaxed font-lora">
                          {verse.malayalam}
                        </p>
                      )}
                      {language === "hebrew" && (
                        <p
                          className="text-parchment text-xl leading-loose font-hebrew"
                          dir="rtl"
                        >
                          {verse.hebrew}
                        </p>
                      )}

                      {/* Hebrew word pills */}
                      {verse.hebrewWords && verse.hebrewWords.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {verse.hebrewWords.map((hw) => (
                            <button
                              key={hw.word}
                              onClick={() =>
                                setActiveWord(activeWord === hw.word ? null : hw.word)
                              }
                              className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${
                                activeWord === hw.word
                                  ? "border-gold bg-gold/20 text-gold"
                                  : "border-parchment/15 text-parchment/50 hover:border-parchment/40"
                              }`}
                            >
                              <span
                                className="font-hebrew mr-1"
                                dir="rtl"
                                style={{ fontFamily: "'Frank Ruhl Libre', serif" }}
                              >
                                {hw.word}
                              </span>
                              <span className="text-xs opacity-60">({hw.transliteration})</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Active word detail */}
                      {activeWord &&
                        verse.hebrewWords?.find((hw) => hw.word === activeWord) && (
                          <div className="mt-4 border border-gold/20 rounded-xl p-4 bg-gold/5">
                            {(() => {
                              const hw = verse.hebrewWords!.find((h) => h.word === activeWord)!;
                              return (
                                <>
                                  <div className="flex items-start justify-between mb-2">
                                    <span
                                      className="text-gold text-2xl font-hebrew"
                                      dir="rtl"
                                      style={{ fontFamily: "'Frank Ruhl Libre', serif" }}
                                    >
                                      {hw.word}
                                    </span>
                                    <button
                                      onClick={() => setActiveWord(null)}
                                      className="text-parchment/30 hover:text-parchment text-lg"
                                    >
                                      ×
                                    </button>
                                  </div>
                                  <p className="text-parchment/50 text-xs mb-1">
                                    Transliteration:{" "}
                                    <span className="text-parchment/70 italic">{hw.transliteration}</span>
                                  </p>
                                  <p className="text-parchment/50 text-xs mb-1">
                                    Root:{" "}
                                    <span className="text-parchment/70 font-hebrew" dir="rtl">
                                      {hw.root}
                                    </span>
                                  </p>
                                  <p className="text-parchment/50 text-xs mb-2">
                                    Meaning:{" "}
                                    <span className="text-gold/80">{hw.meaning}</span>
                                  </p>
                                  <p className="text-parchment/40 text-xs leading-relaxed italic">
                                    {hw.usage}
                                  </p>
                                </>
                              );
                            })()}
                          </div>
                        )}
                    </div>

                    {/* Academic explanation accordion */}
                    <div className="border-t border-parchment/10">
                      <button
                        onClick={() => toggleExplanation(key)}
                        className="w-full px-5 py-3 flex items-center justify-between text-parchment/40 hover:text-parchment/70 transition-colors text-sm"
                      >
                        <span>Academic Explanation</span>
                        <span className="text-lg">{isExpOpen ? "−" : "+"}</span>
                      </button>
                      {isExpOpen && (
                        <div className="px-5 pb-4">
                          <p className="text-parchment/50 text-sm leading-relaxed">
                            {verse.explanation}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Real life example */}
                    {verse.realLifeExample && (
                      <div className="border-t border-parchment/10 px-5 py-4 bg-slate/10">
                        <p className="text-parchment/30 text-xs uppercase tracking-widest mb-2">
                          Real Life Example
                        </p>
                        <p className="text-parchment/50 text-sm leading-relaxed italic">
                          {verse.realLifeExample}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mark complete button */}
            <div className="px-6 pb-8 max-w-3xl text-center">
              {completed.includes(chapter.number) ? (
                <div>
                  <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-gold/30 bg-gold/10 text-gold text-sm mb-2">
                    ✓ Chapter {chapter.number} Read
                  </div>
                  {/* Show next step hint even if already read */}
                  {currentChapter < genesis.length - 1 && (
                    <p
                      className="text-parchment/30 text-xs mt-3 cursor-pointer hover:text-parchment/60 transition-colors"
                      onClick={() => setChapterComplete(true)}
                    >
                      See what to do next →
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <button
                    onClick={markComplete}
                    className="px-8 py-4 bg-gold text-ink font-semibold rounded-xl hover:bg-gold-light transition-all text-sm uppercase tracking-wide"
                  >
                    I Have Read This Chapter
                  </button>
                  {currentChapter < genesis.length - 1 && (
                    <p className="text-parchment/30 text-xs mt-3">
                      Unlocks Conquest Mode for Chapter {chapter.number}
                    </p>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* ── Conquest gate modal ── */}
      {conquestGate !== null && (
        <div className="fixed inset-0 bg-ink/90 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate/90 border border-parchment/10 rounded-2xl p-8 w-full max-w-md text-center">
            <div className="w-14 h-14 rounded-full bg-ember/20 flex items-center justify-center text-2xl mx-auto mb-4">
              ⚔️
            </div>
            <h3 className="text-parchment font-serif text-xl mb-2">
              Chapter {conquestGate + 1} is Locked
            </h3>
            <p className="text-parchment/50 text-sm leading-relaxed mb-6">
              Complete the <span className="text-gold">Chapter {conquestGate} Conquest Challenge</span> to unlock Chapter {conquestGate + 1}. Test your knowledge of the Hebrew words you've learned.
            </p>
            <button
              onClick={() => {
                setConquestGate(null);
                navigate(`/conquest?chapter=${conquestGate}`);
              }}
              className="w-full py-3.5 bg-gold text-ink font-semibold rounded-xl hover:bg-gold-light transition-all text-sm uppercase tracking-wide mb-3"
            >
              Enter Conquest Mode →
            </button>
            <button
              onClick={() => setConquestGate(null)}
              className="text-parchment/30 text-sm hover:text-parchment transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}

      {/* ── Auth modal ── */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50">
          {/* Context message banner above modal */}
          {authContext && (
            <div className="fixed top-0 inset-x-0 z-60 bg-gold/10 border-b border-gold/20 px-4 py-3 text-center">
              <p className="text-gold text-sm">{authContext}</p>
            </div>
          )}
          <AuthModal
            onClose={() => {
              setShowAuthModal(false);
              setAuthContext(null);
            }}
            onSuccess={() => {
              setShowAuthModal(false);
              setAuthContext(null);
            }}
          />
        </div>
      )}
    </div>
  );
}