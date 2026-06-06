import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getChapterWords, type ConquestWord } from "../component/data/conquestData";

type Screen = "map" | "study" | "complete";

const chapterCompletionMessages: Record<number, { title: string; message: string; next: string }> = {
  1: {
    title: "Creation Conquered",
    message: "You've mastered the Hebrew words of Genesis Chapter 1 — the language of creation itself. Bereishit. Bara. Elohim. These words built a universe.",
    next: "Enter the Sabbath →",
  },
  2: {
    title: "Sabbath Mastered",
    message: "You now carry the language of sacred rest. Vaykhulu. Vayishbot. Vayekadesh. The first holy thing God made was not a place — it was time.",
    next: "Enter the Fall →",
  },
  3: {
    title: "The Fall Understood",
    message: "You've studied the words of the oldest deception ever recorded. Nachash. Arum. Tov vaRa. The serpent's cunning lives in language — and now you see it clearly.",
    next: "Return to the Codex →",
  },
};

export default function ConquestPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const chapterNumber = parseInt(searchParams.get("chapter") ?? "1");
  const conquestChapter = getChapterWords(chapterNumber);

  const [screen, setScreen] = useState<Screen>("map");
  const [activeWord, setActiveWord] = useState<ConquestWord | null>(null);
  const [studied, setStudied] = useState<Set<string>>(new Set());
  const [totalXP, setTotalXP] = useState(0);
  const [usageIndex, setUsageIndex] = useState(0);

  const completion = chapterCompletionMessages[chapterNumber] ?? chapterCompletionMessages[1];

  function openWord(word: ConquestWord) {
    setActiveWord(word);
    setUsageIndex(0);
    setScreen("study");
  }

  function completeWord() {
    if (!activeWord) return;
    const next = new Set(studied);
    next.add(activeWord.id);
    setStudied(next);
    setTotalXP((xp) => xp + activeWord.xp);
    if (next.size === conquestChapter.words.length) {
      setScreen("complete");
    } else {
      setScreen("map");
    }
  }

  if (screen === "complete") {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="text-6xl mb-6">🏆</p>
          <h1 className="text-3xl font-serif text-gold mb-4">{completion.title}</h1>
          <p className="text-parchment/60 mb-4 leading-relaxed">{completion.message}</p>
          <p className="text-gold font-bold text-xl mb-8">+{totalXP} XP earned</p>
          <button
            onClick={() => navigate(chapterNumber < 3 ? `/codex?chapter=${chapterNumber + 1}` : "/codex")}
            className="px-8 py-4 bg-gold text-ink font-semibold rounded hover:bg-gold-light transition-all text-sm uppercase tracking-wide"
          >
            {completion.next}
          </button>
        </div>
      </div>
    );
  }

  if (screen === "study" && activeWord) {
    return (
      <div className="min-h-screen bg-ink px-4 py-8 max-w-xl mx-auto">
        <button
          onClick={() => setScreen("map")}
          className="text-parchment/40 hover:text-parchment text-sm mb-8 block"
        >
          ← Back to map
        </button>
        <div className="text-center mb-8">
          <p dir="rtl" className="text-7xl font-serif text-gold mb-3">{activeWord.hebrew}</p>
          <p className="text-parchment/60 italic text-lg">{activeWord.transliteration}</p>
        </div>
        <div className="space-y-4 mb-8">
          <div className="border border-parchment/10 rounded-lg p-5">
            <p className="text-xs text-parchment/40 uppercase tracking-widest mb-1">Root</p>
            <p className="text-parchment font-serif">{activeWord.root}</p>
          </div>
          <div className="border border-parchment/10 rounded-lg p-5">
            <p className="text-xs text-parchment/40 uppercase tracking-widest mb-1">Primary Meaning</p>
            <p className="text-parchment font-serif text-lg">{activeWord.primaryMeaning}</p>
          </div>
          <div className="border border-parchment/10 rounded-lg p-5">
            <p className="text-xs text-parchment/40 uppercase tracking-widest mb-1">Also means</p>
            <p className="text-parchment/70 text-sm">{activeWord.secondaryMeaning}</p>
          </div>
          <div className="border border-gold/20 rounded-lg p-5 bg-gold/5">
            <p className="text-xs text-gold/60 uppercase tracking-widest mb-1">In Genesis</p>
            <p className="text-parchment/70 text-sm">{activeWord.genesisContext}</p>
          </div>
        </div>
        <div className="mb-8">
          <p className="text-xs text-parchment/40 uppercase tracking-widest mb-3">Across the Bible</p>
          <div className="border border-parchment/10 rounded-lg p-5">
            <p className="text-gold text-xs mb-2">{activeWord.bibleUsages[usageIndex].reference}</p>
            <p className="text-parchment/70 text-sm italic leading-relaxed">
              "{activeWord.bibleUsages[usageIndex].text}"
            </p>
            <div className="flex gap-2 mt-4">
              {activeWord.bibleUsages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setUsageIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === usageIndex ? "bg-gold w-5" : "bg-parchment/20"}`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="border border-ember/30 rounded-lg p-5 bg-ember/5 mb-8">
          <p className="text-xs text-ember/70 uppercase tracking-widest mb-2">Memory Aid</p>
          <p className="text-parchment/70 text-sm leading-relaxed">{activeWord.memoryAid}</p>
        </div>
        <button
          onClick={completeWord}
          className="w-full py-4 bg-gold text-ink font-semibold rounded hover:bg-gold-light transition-all text-sm uppercase tracking-wide"
        >
          Word Studied · +{activeWord.xp} XP
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink px-4 py-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => navigate("/codex")}
          className="text-parchment/40 hover:text-parchment text-sm"
        >
          ← Codex
        </button>
        <div className="text-right">
          <p className="text-gold font-bold">{totalXP} XP</p>
          <p className="text-parchment/30 text-xs">
            {studied.size}/{conquestChapter.words.length} words
          </p>
        </div>
      </div>

      <div className="text-center mb-10">
        <p className="text-gold/60 text-xs uppercase tracking-widest mb-1">Conquest Mode</p>
        <h1 className="text-3xl font-serif text-parchment">
          Genesis · Chapter {chapterNumber}
        </h1>
        <p className="text-gold/50 font-serif italic mt-1">{conquestChapter.title}</p>
        <p className="text-parchment/40 text-sm mt-2">
          Study each word to unlock Chapter {chapterNumber + 1}
        </p>
      </div>

      <div className="h-1 bg-parchment/10 rounded-full mb-10 overflow-hidden">
        <div
          className="h-full bg-gold rounded-full transition-all duration-500"
          style={{ width: `${(studied.size / conquestChapter.words.length) * 100}%` }}
        />
      </div>

      <div className="space-y-4">
        {conquestChapter.words.map((word, i) => {
          const done = studied.has(word.id);
          const locked = i > 0 && !studied.has(conquestChapter.words[i - 1].id);
          return (
            <button
              key={word.id}
              onClick={() => !locked && openWord(word)}
              disabled={locked}
              className={`w-full flex items-center gap-5 p-5 rounded-xl border transition-all text-left
                ${done ? "border-gold/40 bg-gold/5" : locked ? "border-parchment/5 opacity-40 cursor-not-allowed" : "border-parchment/20 hover:border-gold/40 hover:bg-slate/10"}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-serif shrink-0
                ${done ? "bg-gold text-ink" : "bg-slate/30 text-gold"}`}>
                {done ? "✓" : <span dir="rtl">{word.hebrew.split("")[0]}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p dir="rtl" className="text-gold font-serif text-lg">{word.hebrew}</p>
                <p className="text-parchment/50 text-sm">{word.transliteration} · {word.primaryMeaning}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-xs font-bold ${done ? "text-gold" : "text-parchment/30"}`}>
                  {done ? `+${word.xp} XP` : `${word.xp} XP`}
                </p>
                {locked && <p className="text-parchment/20 text-xs mt-1">🔒</p>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}