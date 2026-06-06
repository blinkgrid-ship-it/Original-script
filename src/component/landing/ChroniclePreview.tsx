import { useState, useEffect } from "react";
import { chronicleCards } from "../data/landingData";

export default function ChroniclePreview() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActive((a) => (a + 1) % chronicleCards.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const card = chronicleCards[active];

  return (
    <section className="py-24 px-6 bg-slate/10">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-parchment mb-4">
          The Chronicle Feed
        </h2>
        <p className="text-parchment/60 mb-12">
          Every day, a curated window into scripture's living history.
        </p>
        <div className="relative min-h-[200px] border border-gold/20 rounded-xl bg-ink p-8">
          <span className="absolute top-4 right-4 text-xs text-gold/60 uppercase tracking-widest border border-gold/20 px-2 py-1 rounded">
            {card.tag}
          </span>
          {"hebrew" in card ? (
            <div className="text-center py-4">
              <p dir="rtl" className="text-5xl font-serif text-gold mb-2">
                {card.hebrew}
              </p>
              <p className="text-parchment/70 text-lg italic mb-1">
                {card.transliteration}
              </p>
              <p className="text-parchment font-serif text-2xl mb-2">{card.meaning}</p>
              <p className="text-parchment/40 text-sm">{card.reference}</p>
            </div>
          ) : (
            <div className="text-left py-4">
              <h3 className="text-parchment font-serif text-xl mb-3">{card.title}</h3>
              {"subtitle" in card && (
                <p className="text-gold/70 text-xs uppercase tracking-wider mb-3">{card.subtitle}</p>
              )}
              <p className="text-parchment/60 text-sm leading-relaxed">{card.description}</p>
            </div>
          )}
        </div>
        <div className="flex justify-center gap-2 mt-6">
          {chronicleCards.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === active ? "bg-gold w-6" : "bg-parchment/20"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}