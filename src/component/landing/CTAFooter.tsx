import { useState } from "react";

export default function CTAFooter() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="py-24 px-6 bg-slate/10 border-t border-gold/10">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-serif text-parchment mb-4">
          Is your church on Original Script?
        </h2>
        <p className="text-parchment/60 mb-10">
          Bring it to your community — with your branding, your denomination's
          lens, your members' own space.
        </p>
        {submitted ? (
          <p className="text-gold font-serif text-lg">
            ✓ We'll be in touch soon.
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="flex flex-col gap-4"
          >
            <input
              type="text"
              placeholder="Your name"
              required
              className="w-full px-4 py-3 bg-ink border border-parchment/20 rounded text-parchment placeholder-parchment/30 focus:outline-none focus:border-gold"
            />
            <input
              type="email"
              placeholder="Your email"
              required
              className="w-full px-4 py-3 bg-ink border border-parchment/20 rounded text-parchment placeholder-parchment/30 focus:outline-none focus:border-gold"
            />
            <input
              type="text"
              placeholder="Church name"
              required
              className="w-full px-4 py-3 bg-ink border border-parchment/20 rounded text-parchment placeholder-parchment/30 focus:outline-none focus:border-gold"
            />
            <textarea
              placeholder="Tell us a bit about your community"
              rows={3}
              className="w-full px-4 py-3 bg-ink border border-parchment/20 rounded text-parchment placeholder-parchment/30 focus:outline-none focus:border-gold resize-none"
            />
            <button
              type="submit"
              className="w-full px-8 py-4 bg-gold text-ink font-semibold rounded hover:bg-gold-light transition-all text-sm uppercase tracking-wide"
            >
              Bring Original Script to My Church
            </button>
          </form>
        )}
      </div>
      <p className="text-center text-parchment/20 text-xs mt-16">
        © {new Date().getFullYear()} Original Script. Built for the global Christian community.
      </p>
    </section>
  );
}