import type { ChronicleEntry } from "../data/chronicleData";

interface Props {
  entry: ChronicleEntry;
}
interface Props {
  entry: ChronicleEntry;
}

export default function ChronicleCard({ entry }: Props) {
  if (entry.type === "word") {
    return (
      <div className="border border-gold/20 rounded-xl p-6 bg-ink hover:border-gold/40 transition-all">
        <div className="flex items-start justify-between mb-4">
          <span className="text-xs text-gold/60 uppercase tracking-widest border border-gold/20 px-2 py-1 rounded">
            {entry.tag}
          </span>
          {entry.reference && (
            <span className="text-xs text-parchment/30">{entry.reference}</span>
          )}
        </div>
        <p dir="rtl" className="text-5xl font-serif text-gold mb-2">
          {entry.hebrew}
        </p>
        <p className="text-parchment/60 italic text-base mb-1">
          {entry.transliteration}
        </p>
        <p className="text-parchment font-serif text-xl mb-3">
          {entry.meaning}
        </p>
        {entry.description && (
          <p className="text-parchment/50 text-sm leading-relaxed">
            {entry.description}
          </p>
        )}
      </div>
    );
  }

  if (entry.type === "feature") {
    return (
      <div className="border border-parchment/20 rounded-xl p-7 bg-slate/20 hover:border-gold/30 transition-all">
        <div className="flex items-start justify-between mb-4">
          <span className="text-xs text-gold/60 uppercase tracking-widest border border-gold/20 px-2 py-1 rounded">
            {entry.tag}
          </span>
          {entry.date && (
            <span className="text-xs text-parchment/30">Date specific</span>
          )}
        </div>
        {entry.subtitle && (
          <p className="text-gold/70 text-xs uppercase tracking-wider mb-2">
            {entry.subtitle}
          </p>
        )}
        <h3 className="text-parchment font-serif text-2xl mb-3">
          {entry.title}
        </h3>
        {entry.description && (
          <p className="text-parchment/60 text-sm leading-relaxed mb-4">
            {entry.description}
          </p>
        )}
        {entry.sourceUrl && (
          <a
            href={entry.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold text-sm hover:underline"
          >
            Read more →
          </a>
        )}
      </div>
    );
  }

  // insight
  return (
    <div className="border border-parchment/10 rounded-xl p-6 bg-ink hover:border-parchment/20 transition-all">
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs text-parchment/40 uppercase tracking-widest border border-parchment/10 px-2 py-1 rounded">
          {entry.tag}
        </span>
      </div>
      <h3 className="text-parchment font-serif text-xl mb-3">{entry.title}</h3>
      {entry.description && (
        <p className="text-parchment/60 text-sm leading-relaxed mb-4">
          {entry.description}
        </p>
      )}
      {entry.sourceUrl && (
        <a
          href={entry.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold text-sm hover:underline"
        >
          Read more →
        </a>
      )}
    </div>
  );
}