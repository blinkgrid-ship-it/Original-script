const panels = [
  {
    label: "The Light",
    icon: "☀️",
    description:
      "God — infinite, undivided, source of all truth. The light itself does not change.",
  },
  {
    label: "The Film",
    icon: "🎞️",
    description:
      "The Bible — written by humans, in human language, in human history. A film that captures the light.",
  },
  {
    label: "Your Colors",
    icon: "🌈",
    description:
      "Your denomination — the color you see on the screen. All colors come from the same light.",
  },
];

export default function ProjectorMetaphor() {
  return (
    <section id="what" className="py-24 px-6 bg-slate/10">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-parchment mb-4">
          What is Original Script?
        </h2>
        <p className="text-parchment/60 mb-16 max-w-xl mx-auto">
          Not a Bible app. Not a devotional. Something that does not exist yet.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {panels.map((panel, i) => (
            <div
              key={i}
              className="p-8 border border-gold/20 rounded-lg bg-ink/50 hover:border-gold/50 transition-all"
            >
              <div className="text-5xl mb-4">{panel.icon}</div>
              <h3 className="text-gold font-serif text-xl mb-3">{panel.label}</h3>
              <p className="text-parchment/60 text-sm leading-relaxed">
                {panel.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}