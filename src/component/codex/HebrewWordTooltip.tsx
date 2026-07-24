import { useState } from "react";
import type { HebrewWord } from "../../data/codexData";

interface Props {
  word: HebrewWord;
}

export default function HebrewWordTooltip({ word }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center min-w-11 min-h-11 mx-1 px-1 rounded text-gold hover:bg-gold/20 transition-all cursor-pointer font-serif text-xl"
        dir="rtl"
      >
        {word.word}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center px-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md max-h-[85vh] overflow-y-auto bg-ink border border-gold/30 rounded-t-2xl sm:rounded-2xl p-6 pb-8">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 w-11 h-11 flex items-center justify-center text-parchment/40 hover:text-parchment text-xl"
            >
              ✕
            </button>
            <p dir="rtl" className="text-5xl font-serif text-gold mb-1">
              {word.word}
            </p>
            <p className="text-parchment/60 italic text-sm mb-4">
              {word.transliteration}
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <span className="text-parchment/40 w-24 shrink-0">Meaning</span>
                <span className="text-parchment">{word.meaning}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-parchment/40 w-24 shrink-0">Root</span>
                <span className="text-parchment">{word.root}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-parchment/40 w-24 shrink-0">Usage</span>
                <span className="text-parchment leading-relaxed">{word.usage}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}