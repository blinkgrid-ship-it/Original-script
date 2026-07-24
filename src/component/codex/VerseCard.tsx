import { useState } from "react";
import type { Verse } from "../../data/codexData";
import HebrewWordTooltip from "./HebrewWordTooltip";

interface Props {
  verse: Verse;
}

export default function VerseCard({ verse }: Props) {
  const [explanationOpen, setExplanationOpen] = useState(false);

  return (
    <div className="border border-parchment/10 rounded-xl overflow-hidden mb-6">
      {/* Verse number */}
      <div className="px-6 py-3 bg-slate/20 border-b border-parchment/10 flex items-center gap-3">
        <span className="text-gold font-serif text-sm font-bold">
          Verse {verse.number}
        </span>
      </div>

      {/* Three column layout */}
      <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-parchment/10">
        {/* English */}
        <div className="p-6">
          <p className="text-xs text-parchment/40 uppercase tracking-widest mb-3">
            English
          </p>
          <p className="text-parchment font-serif leading-relaxed text-base">
            {verse.english}
          </p>
        </div>

        {/* Malayalam */}
        <div className="p-6">
          <p className="text-xs text-parchment/40 uppercase tracking-widest mb-3">
            Malayalam
          </p>
          <p className="text-parchment font-serif leading-relaxed text-base">
            {verse.malayalam}
          </p>
        </div>

        {/* Hebrew */}
        <div className="p-6">
          <p className="text-xs text-parchment/40 uppercase tracking-widest mb-3">
            Hebrew
          </p>
          <p dir="rtl" className="text-parchment font-serif leading-relaxed text-lg mb-4 break-words">
            {verse.hebrew}
          </p>
          <div className="flex flex-wrap gap-1 justify-end">
            {verse.hebrewWords.map((w, i) => (
              <HebrewWordTooltip key={i} word={w} />
            ))}
          </div>
          <p className="text-parchment/30 text-xs mt-2 text-right">
            Tap a word to explore
          </p>
        </div>
      </div>

      {/* Explanation accordion */}
      <div className="border-t border-parchment/10">
        <button
          onClick={() => setExplanationOpen(!explanationOpen)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate/10 transition-all"
        >
          <span className="text-parchment/70 text-sm font-sans">
            Academic Explanation
          </span>
          <span className="text-gold text-lg">
            {explanationOpen ? "−" : "+"}
          </span>
        </button>
        {explanationOpen && (
          <div className="px-6 pb-6">
            <p className="text-parchment/70 text-sm leading-relaxed">
              {verse.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Real Life Example */}
      <div className="border-t border-parchment/10 bg-amber-950/20 px-6 py-5">
        <p className="text-xs text-gold/60 uppercase tracking-widest mb-2">
          Real Life Example
        </p>
        <p className="text-parchment/70 text-sm leading-relaxed italic">
          {verse.realLifeExample}
        </p>
      </div>
    </div>
  );
}