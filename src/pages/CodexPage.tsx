import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { genesis } from "../data/codexData";
import { useAuth } from "../context/AuthContext";

type Language = "english" | "malayalam" | "hebrew";

export default function CodexPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentChapter, setCurrentChapter] = useState(0);
  const [language, setLanguage] = useState<Language>("english");
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [openExplanations, setOpenExplanations] = useState<Set<number>>(new Set());
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const chapter = genesis[currentChapter];

  function toggleExplanation(verseNumber: number) {
    setOpenExplanations((prev) => {
      const next = new Set(prev);
      next.has(verseNumber) ? next.delete(verseNumber) : next.add(verseNumber);
      return next;
    });
  }

  function markComplete() {
    setCompleted((prev) => new Set([...prev, currentChapter]));
  }

  // Gate chapter 2+ behind auth
  if (currentChapter > 0 && !user) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <p className="text-5xl mb-4">📜</p>
          <h2 className="text-2xl font-serif text-parchment mb-3">
            Continue Your Journey
          </h2>
          <p className="text-parchment/50 text-sm mb-8">
            Create a free account to unlock Chapter 2 and beyond.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full py-4 bg-gold text-ink font-semibold rounded hover:bg-gold-light transition-all text-sm uppercase tracking-wide"
          >
            Create Free Account
          </button>
          <button
            onClick={() => setCurrentChapter(0)}
            className="mt-4 text-parchment/30 text-xs hover:text-parchment transition-colors block mx-auto"
          >
            ← Back to Chapter 1
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink">
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-8">
        {/* Chapter tabs */}
        <div className="flex gap-2 overflow-x-auto py-3 mb-6">
          {genesis.map((ch, i) => {
            const locked = i > 0 && !user;
            return (
              <button
                key={ch.number}
                onClick={() => !locked && setCurrentChapter(i)}
                disabled={locked}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all border ${
                  currentChapter === i
                    ? "border-gold bg-gold/10 text-gold"
                    : locked
                    ? "border-parchment/5 text-parchment/20 cursor-not-allowed"
                    : completed.has(i)
                    ? "border-parchment/20 text-parchment/50"
                    : "border-parchment/10 text-parchment/40 hover:border-parchment/30"
                }`}
              >
                {locked ? "🔒 " : completed.has(i) ? "✓ " : ""}
                Ch. {ch.number}
              </button>
            );
          })}
        </div>

        {/* Language toggle */}
        <div className="flex rounded-lg border border-parchment/10 overflow-hidden mb-8 w-fit">
          {(["english", "malayalam", "hebrew"] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-4 py-2 text-xs uppercase tracking-wider transition-all ${
                language === lang
                  ? "bg-gold text-ink font-semibold"
                  : "text-parchment/40 hover:text-parchment"
              }`}
            >
              {lang === "english"
                ? "English"
                : lang === "malayalam"
                ? "Malayalam"
                : "עברית"}
            </button>
          ))}
        </div>

        {/* Verses */}
        {chapter.verses.map((verse) => (
          <div
            key={verse.number}
            className="mb-8 border border-parchment/10 rounded-xl overflow-hidden"
          >
            {/* Verse number */}
            <div className="px-5 py-3 bg-slate/20 border-b border-parchment/10">
              <span className="text-gold font-serif text-sm font-bold">
                Verse {verse.number}
              </span>
            </div>

            {/* Verse text */}
            <div className="p-5">
              {language === "english" && (
                <p className="text-parchment font-serif leading-relaxed text-base">
                  {verse.english}
                </p>
              )}
              {language === "malayalam" && (
                <p className="text-parchment font-serif leading-relaxed text-base">
                  {verse.malayalam}
                </p>
              )}
              {language === "hebrew" && (
                <div>
                  <p
                    dir="rtl"
                    className="text-parchment leading-loose text-xl mb-4"
                    style={{
                      fontFamily: "'Frank Ruhl Libre', serif",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {verse.hebrew}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-end">
                    {verse.hebrewWords.map((w, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          setActiveWord(activeWord === w.word ? null : w.word)
                        }
                        dir="rtl"
                        className={`px-2 py-1 rounded text-lg transition-all ${
                          activeWord === w.word
                            ? "bg-gold/20 border border-gold text-gold"
                            : "hover:bg-gold/10 text-gold/80 border border-transparent"
                        }`}
                        style={{ fontFamily: "'Frank Ruhl Libre', serif" }}
                      >
                        {w.word}
                      </button>
                    ))}
                  </div>
                  <p className="text-parchment/20 text-xs mt-2 text-right">
                    Tap a word to explore
                  </p>

                  {/* Hebrew word bottom sheet */}
                  {activeWord && (
                    <div className="mt-4 border border-gold/20 rounded-xl p-5 bg-gold/5">
                      {verse.hebrewWords
                        .filter((w) => w.word === activeWord)
                        .map((w, i) => (
                          <div key={i}>
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p
                                  dir="rtl"
                                  className="text-gold text-4xl font-serif"
                                  style={{
                                    fontFamily: "'Frank Ruhl Libre', serif",
                                  }}
                                >
                                  {w.word}
                                </p>
                                <p className="text-parchment/50 italic text-sm">
                                  {w.transliteration}
                                </p>
                              </div>
                              <button
                                onClick={() => setActiveWord(null)}
                                className="text-parchment/30 hover:text-parchment text-lg"
                              >
                                ✕
                              </button>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex gap-3">
                                <span className="text-parchment/30 w-20 shrink-0">Root</span>
                                <span className="text-parchment">{w.root}</span>
                              </div>
                              <div className="flex gap-3">
                                <span className="text-parchment/30 w-20 shrink-0">Meaning</span>
                                <span className="text-parchment">{w.meaning}</span>
                              </div>
                              <div className="flex gap-3">
                                <span className="text-parchment/30 w-20 shrink-0">Usage</span>
                                <span className="text-parchment/70 leading-relaxed">
                                  {w.usage}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Explanation accordion */}
            <div className="border-t border-parchment/10">
              <button
                onClick={() => toggleExplanation(verse.number)}
                className="w-full px-5 py-3 flex items-center justify-between hover:bg-slate/10 transition-all"
              >
                <span className="text-parchment/50 text-sm">Academic Explanation</span>
                <span className="text-gold text-lg">
                  {openExplanations.has(verse.number) ? "−" : "+"}
                </span>
              </button>
              {openExplanations.has(verse.number) && (
                <div className="px-5 pb-5">
                  <p className="text-parchment/60 text-sm leading-relaxed">
                    {verse.explanation}
                  </p>
                </div>
              )}
            </div>

            {/* Real Life Example */}
            <div className="border-t border-parchment/10 bg-amber-950/20 px-5 py-4">
              <p className="text-xs text-gold/50 uppercase tracking-widest mb-2">
                Real Life Example
              </p>
              <p className="text-parchment/60 text-sm leading-relaxed italic">
                {verse.realLifeExample}
              </p>
            </div>
          </div>
        ))}

        {/* Completion */}
        {!completed.has(currentChapter) ? (
          <div className="text-center mt-8">
            <button
              onClick={markComplete}
              className="px-8 py-4 bg-gold text-ink font-semibold rounded-xl hover:bg-gold-light transition-all text-sm uppercase tracking-wide"
            >
              I Have Read This Chapter
            </button>
            <p className="text-parchment/30 text-xs mt-3">
              Unlocks Conquest Mode for Chapter {chapter.number}
            </p>
          </div>
        ) : (
          <div className="text-center mt-8 border border-gold/30 rounded-xl p-8 bg-gold/5">
            <p className="text-3xl mb-3">✓</p>
            <h3 className="text-gold font-serif text-xl mb-2">
              Chapter {chapter.number} Complete
            </h3>
            <p className="text-parchment/50 text-sm mb-6">
              Conquest Mode for this chapter is now unlocked.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate(`/conquest?chapter=${chapter.number}`)}
                className="px-6 py-3 bg-gold text-ink font-semibold rounded-xl hover:bg-gold-light transition-all text-sm uppercase tracking-wide"
              >
                Enter Conquest Mode →
              </button>
              {currentChapter < genesis.length - 1 && (
                <button
                  onClick={() => {
                    if (!user) navigate("/");
                    else setCurrentChapter(currentChapter + 1);
                  }}
                  className="px-6 py-3 border border-parchment/20 text-parchment/60 rounded-xl hover:border-gold hover:text-gold transition-all text-sm"
                >
                  Next Chapter →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}