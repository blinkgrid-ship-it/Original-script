import { pathways } from "../data/landingData";

export default function PathwayPreviews() {
  return (
    <section id="pathways" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-parchment mb-4">
            Choose Your Path
          </h2>
          <p className="text-parchment/60">
            Original Script meets you where you are.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {pathways.map((p, i) => (
            <div
              key={i}
              className="p-8 border border-parchment/10 rounded-lg bg-slate/10 hover:bg-slate/20 hover:border-gold/30 transition-all group cursor-pointer"
            >
              <div className="text-4xl mb-4">{p.icon}</div>
              <h3 className="text-parchment font-serif text-xl mb-3">
                {p.name}
              </h3>
              <p className="text-parchment/50 text-sm leading-relaxed mb-6">
                {p.description}
              </p>
              <span className="text-gold text-sm group-hover:underline">
                {p.cta} →
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}