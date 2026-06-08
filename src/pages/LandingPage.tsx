import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTodayQuestion, mockAnswers } from "../data/questionData";
import AuthModal from "../component/AuthModal";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [scriptureOpen, setScriptureOpen] = useState(false);

  const question = getTodayQuestion();
  const previewAnswers = mockAnswers.slice(0, 2);

  function requireAuth(then: () => void) {
    if (user) then();
    else setShowAuth(true);
  }

  return (
    <div className="min-h-screen bg-ink text-parchment">

      {/* ── Hero ── */}
      <section className="border-b border-parchment/10 px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs mb-8 tracking-wider">
          📜 Faith-Deepening · Scriptural Intelligence · Non-Profit
        </div>

        <h1 className="text-5xl md:text-6xl font-serif text-parchment mb-5 leading-tight max-w-3xl mx-auto">
          The <span className="text-gold">Original Script</span>
        </h1>
        <p className="text-parchment/50 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Scripture as it was written. In the language it was spoken.
          With the depth it was meant to carry.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button
            onClick={() => requireAuth(() => navigate("/codex"))}
            className="px-7 py-3.5 bg-gold text-ink font-semibold rounded-lg hover:bg-gold-light transition-all text-sm"
          >
            Open the Codex →
          </button>
       
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto border-t border-parchment/10 pt-10">
          {[
            { value: "3", label: "Genesis Chapters" },
            { value: "11", label: "Hebrew Words" },
            { value: "3", label: "Languages" },
            { value: "0", label: "Theological Bias" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-gold font-serif font-bold text-3xl">{stat.value}</p>
              <p className="text-parchment/30 text-xs uppercase tracking-widest mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Question of the Day ── */}
      <section className="border-b border-parchment/10 py-14 px-6">
        <p className="text-parchment/30 text-xs uppercase tracking-widest text-center mb-10">
          — Question of the Day —
        </p>

        <div className="max-w-3xl mx-auto">
          {/* Featured question card */}
          <div className="border border-gold/20 rounded-2xl overflow-hidden mb-8">
            <div className="bg-slate/20 px-6 pt-8 pb-6">
              <div className="flex items-center gap-3 mb-5">
                <span className="px-3 py-1 rounded-full bg-gold/20 text-gold text-xs tracking-wider">
                  Daily Reflection
                </span>
                <span className="text-parchment/30 text-xs">
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="text-parchment font-serif text-2xl leading-relaxed mb-6">
                {question.text}
              </p>

              {/* Scripture toggle */}
              <button
                onClick={() => setScriptureOpen(!scriptureOpen)}
                className="flex items-center gap-3 text-left w-full group"
              >
                <span className="w-0.5 h-6 bg-gold/40 rounded-full" />
                <span className="text-gold/70 text-sm italic font-serif">
                  {question.scripture.reference}
                </span>
                <span className="text-parchment/30 text-xs ml-auto">
                  {scriptureOpen ? "hide" : "read passage"}
                </span>
              </button>
              {scriptureOpen && (
                <div className="mt-4 pl-5 border-l border-gold/20">
                  <p className="text-parchment/60 text-sm italic leading-relaxed">
                    "{question.scripture.passage}"
                  </p>
                </div>
              )}
            </div>

            {/* Answer / login CTA */}
            <div className="px-6 py-5 border-t border-parchment/10 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-parchment/30">
                <span>{mockAnswers.length} reflections shared</span>
                <span>·</span>
                <span>{question.scripture.reference}</span>
              </div>
              {user ? (
                <button
                  onClick={() => navigate("/question")}
                  className="px-5 py-2.5 bg-gold text-ink text-xs font-semibold rounded-lg hover:bg-gold-light transition-all uppercase tracking-wide"
                >
                  Answer Today's Question →
                </button>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="px-5 py-2.5 border border-gold/30 text-gold/70 text-xs rounded-lg hover:border-gold hover:text-gold transition-all"
                >
                  ✦ Sign in to share your reflection
                </button>
              )}
            </div>
          </div>

          {/* Community preview */}
          <p className="text-parchment/30 text-xs uppercase tracking-widest mb-4">
            Community Reflections
          </p>
          <div className="space-y-3 mb-4">
            {previewAnswers.map((ans) => (
              <div
                key={ans.id}
                className="border border-parchment/10 rounded-xl p-5 bg-slate/10"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-slate/50 flex items-center justify-center text-xs text-gold font-bold">
                    {ans.userName.charAt(0)}
                  </div>
                  <span className="text-parchment/60 text-sm font-medium">
                    {ans.userName}
                  </span>
                  <span className="text-parchment/20 text-xs">·</span>
                  <span className="text-parchment/30 text-xs">{ans.pathway}</span>
                  <span className="ml-auto text-parchment/20 text-xs">{ans.timeAgo}</span>
                </div>
                <p className="text-parchment/60 text-sm leading-relaxed line-clamp-2">
                  {ans.answer}
                </p>
                <button
                  onClick={() => requireAuth(() => navigate("/question"))}
                  className="mt-3 text-xs text-parchment/20 hover:text-gold transition-colors"
                >
                  {user ? "Reply →" : "🔒 Sign in to reply →"}
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => requireAuth(() => navigate("/question"))}
            className="w-full py-3 text-parchment/30 text-xs hover:text-parchment transition-colors border border-dashed border-parchment/10 rounded-xl text-center"
          >
            {user ? "View all community answers →" : "Sign in to see all reflections →"}
          </button>
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section className="py-16 px-6 border-b border-parchment/10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif text-parchment mb-3">The Maze</h2>
          <p className="text-parchment/40 text-base">
            Three pathways into the original text.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {/* Codex */}
          <button
            onClick={() => requireAuth(() => navigate("/codex"))}
            className="border border-parchment/10 rounded-2xl p-7 text-left hover:border-gold/40 transition-all group bg-slate/10"
          >
            <div className="w-11 h-11 rounded-xl bg-gold/20 flex items-center justify-center text-xl mb-5">
              📜
            </div>
            <h3 className="text-parchment font-serif text-lg mb-2 group-hover:text-gold transition-colors">
              The Codex
            </h3>
            <p className="text-parchment/40 text-sm leading-relaxed mb-4">
              Read Genesis in English, Malayalam and Hebrew. Tap each Hebrew word for root
              meanings, etymology, and scholarly context.
            </p>
            {!user && (
              <span className="text-parchment/20 text-xs border border-parchment/10 rounded px-2 py-1">
                Login to unlock
              </span>
            )}
            {user && (
              <span className="text-gold/50 text-xs uppercase tracking-wider">
                Genesis · 3 Chapters →
              </span>
            )}
          </button>

          {/* Conquest */}
          <button
            onClick={() => requireAuth(() => navigate("/conquest?chapter=1"))}
            className="border border-parchment/10 rounded-2xl p-7 text-left hover:border-gold/40 transition-all group bg-slate/10"
          >
            <div className="w-11 h-11 rounded-xl bg-gold/20 flex items-center justify-center text-xl mb-5">
              ⚔️
            </div>
            <h3 className="text-parchment font-serif text-lg mb-2 group-hover:text-gold transition-colors">
              Conquest Study Mode
            </h3>
            <p className="text-parchment/40 text-sm leading-relaxed mb-4">
              Sequential word-by-word mastery with gamified progression. Earn XP, unlock
              chapters, build lasting biblical vocabulary.
            </p>
            {!user && (
              <span className="text-parchment/20 text-xs border border-parchment/10 rounded px-2 py-1">
                Login to unlock
              </span>
            )}
            {user && (
              <span className="text-gold/50 text-xs uppercase tracking-wider">
                11 words · Chapter 1 →
              </span>
            )}
          </button>

          {/* Profile / Journey */}
          <button
            onClick={() => requireAuth(() => navigate("/profile"))}
            className="border border-parchment/10 rounded-2xl p-7 text-left hover:border-gold/40 transition-all group bg-slate/10"
          >
            <div className="w-11 h-11 rounded-xl bg-gold/20 flex items-center justify-center text-xl mb-5">
              ◎
            </div>
            <h3 className="text-parchment font-serif text-lg mb-2 group-hover:text-gold transition-colors">
              My Journey
            </h3>
            <p className="text-parchment/40 text-sm leading-relaxed mb-4">
              Track your 30-day answer history, build daily streaks, and see your growth
              across questions and chapters over time.
            </p>
            {!user && (
              <span className="text-parchment/20 text-xs border border-parchment/10 rounded px-2 py-1">
                Login to unlock
              </span>
            )}
            {user && (
              <span className="text-gold/50 text-xs uppercase tracking-wider">
                Calendar · Streaks →
              </span>
            )}
          </button>
        </div>
      </section>

      {/* ── Join CTA (non-auth only) ── */}
      {!user && (
        <section className="py-16 px-6 border-b border-parchment/10 text-center">
          <p className="text-gold/60 text-xs uppercase tracking-widest mb-4">
            Begin Your Journey
          </p>
          <h2 className="text-3xl font-serif text-parchment mb-4">
            Join the Community
          </h2>
          <p className="text-parchment/40 text-base max-w-lg mx-auto mb-8 leading-relaxed">
            Join a growing community of faith-seekers exploring Scripture in its original
            language — free, open, and free from theological bias.
          </p>
          <button
            onClick={() => setShowAuth(true)}
            className="px-10 py-4 bg-gold text-ink font-semibold rounded-xl hover:bg-gold-light transition-all text-sm uppercase tracking-wide"
          >
            Create Free Account
          </button>
        </section>
      )}

      {/* ── Footer ── */}
      <footer className="border-t border-parchment/10 px-6 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-gold text-lg">📜</span>
              <span className="text-parchment font-serif font-bold">Mission</span>
            </div>
            <p className="text-parchment/40 text-sm leading-relaxed">
              Original Script is committed to making the original biblical languages
              accessible to every serious student, regardless of denominational affiliation.
              All content is open for scholarly audit.
            </p>
          </div>
          <div>
            <p className="text-parchment font-serif font-bold mb-4">What We Offer</p>
            <ul className="space-y-2 text-parchment/40 text-sm">
              <li>· Hebrew word roots &amp; etymology</li>
              <li>· 3-language parallel reading</li>
              <li>· Gamified vocabulary mastery</li>
              <li>· Daily community reflection</li>
            </ul>
          </div>
          <div>
            <p className="text-parchment font-serif font-bold mb-4">Quick Links</p>
            <ul className="space-y-2 text-sm">
              <button
                onClick={() => requireAuth(() => navigate("/codex"))}
                className="block text-parchment/40 hover:text-gold transition-colors"
              >
                Enter the Codex
              </button>
              <button
                onClick={() => requireAuth(() => navigate("/conquest?chapter=1"))}
                className="block text-parchment/40 hover:text-gold transition-colors"
              >
                Conquest Study Mode
              </button>
              <button
                onClick={() => navigate("/question")}
                className="block text-parchment/40 hover:text-gold transition-colors"
              >
                Today's Question
              </button>
              <button
                onClick={() => requireAuth(() => navigate("/profile"))}
                className="block text-parchment/40 hover:text-gold transition-colors"
              >
                My Journey
              </button>
            </ul>
          </div>
        </div>

        <div className="border-t border-parchment/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-gold text-base">📜</span>
            <span className="text-parchment/50 text-sm font-serif">Original Script</span>
          </div>
          <p className="text-parchment/20 text-xs text-center">
            © 2026 Original Script. A faith-deepening initiative for the global Christian community.
          </p>
          <p className="text-gold/40 text-xs">♡ Built for truth, not theology.</p>
        </div>
      </footer>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={() => setShowAuth(false)}
        />
      )}
    </div>
  );
}