import { useNavigate } from "react-router-dom";
export default function Hero() {
    const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24">
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink to-slate/20 pointer-events-none" />
      <div className="relative z-10 max-w-3xl">
        <p className="text-gold/70 text-sm uppercase tracking-[0.3em] mb-4 font-sans">
          Scriptural Intelligence
        </p>
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-parchment leading-tight mb-6">
          Original Script
        </h1>
        <p className="text-xl md:text-2xl text-parchment/70 font-serif italic mb-10">
          Understand scripture the way it was originally written — in Hebrew, in
          history, in archaeological reality.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
         <button
  onClick={() => navigate("/codex")}
  className="px-8 py-4 bg-gold text-ink font-semibold rounded hover:bg-gold-light transition-all text-sm uppercase tracking-wide"
>
  Find Your Community
</button>
<button
  onClick={() => navigate("/codex")}
  className="px-8 py-4 border border-parchment/30 text-parchment rounded hover:border-gold hover:text-gold transition-all text-sm uppercase tracking-wide"
>
  Join as a Learner
</button>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-parchment/30 animate-bounce text-2xl">
        ↓
      </div>
    </section>
  );
}