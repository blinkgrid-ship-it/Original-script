import { stats } from "../data/landingData";

export default function CommunityShowcase() {
  return (
    <section id="community" className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-parchment mb-4">
          A Community Already Waiting
        </h2>
        <div className="flex justify-center gap-16 my-12">
          <div>
            <p className="text-5xl font-serif text-gold font-bold">{stats.communities}+</p>
            <p className="text-parchment/50 text-sm mt-2">Communities</p>
          </div>
          <div>
            <p className="text-5xl font-serif text-gold font-bold">{stats.learners.toLocaleString()}+</p>
            <p className="text-parchment/50 text-sm mt-2">Learners</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {stats.testimonials.map((t, i) => (
            <div key={i} className="p-6 border border-parchment/10 rounded-lg text-left">
              <p className="text-parchment/70 font-serif italic text-base leading-relaxed mb-4">
                "{t.quote}"
              </p>
              <p className="text-gold text-sm">
                {t.name} <span className="text-parchment/30">— {t.location}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}