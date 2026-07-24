import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { fetchTodayQuestion, fetchAnswers, type ApiQuestion, type ApiAnswer } from "../lib/api";
import AuthModal from "../component/AuthModal";

// Faint Hebrew words drifting in the hero background — pure ambience.
const HERO_GLYPHS = [
  { word: "בְּרֵאשִׁית", top: "12%", left: "8%",  size: 42, delay: "0s",   dur: "9s"  },
  { word: "אוֹר",        top: "22%", left: "84%", size: 54, delay: "1.2s", dur: "11s" },
  { word: "דָּבָר",       top: "66%", left: "6%",  size: 38, delay: "2.1s", dur: "10s" },
  { word: "אֱלֹהִים",     top: "74%", left: "88%", size: 34, delay: "0.6s", dur: "12s" },
  { word: "חֶסֶד",       top: "44%", left: "93%", size: 30, delay: "3s",   dur: "9.5s"},
  { word: "אֱמֶת",       top: "56%", left: "3%",  size: 30, delay: "1.8s", dur: "13s" },
];

// Staggered entrance for the hero pieces (transform/opacity only).
const heroStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16, delayChildren: 0.1 } },
};
const heroRise = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};
const mockArtifact = {
  period: "Mesopotamian Period · c. 2217–2193 BCE",
  title: "Cylinder Seal of Ibni-Sharrum",
  description:
    "This Akkadian cylinder seal, attributed to the scribe Ibni-Sharrum during the reign of Shar-Kali-Sharri, depicts a mythological scene involving water deities. The craftsmanship demonstrates the advanced artistic and administrative sophistication of the Akkadian Empire — contemporaneous with the biblical patriarchal period.",
  correlation:
    "The Akkadian administrative infrastructure, evidenced by cylinder seals like this, provides archaeological context for understanding the socio-political environment described in Genesis 10–12 — the post-Babel dispersion and the emergence of Abram from Ur of the Chaldees.",
  source: "Louvre Museum, Paris",
  hebrewTerms: [
    { word: "אַבְרָם", transliteration: "Avram" },
    { word: "אוּר", transliteration: "Ur" },
    { word: "כַּשְׂדִּים", transliteration: "Kasdim" },
  ],
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [scriptureOpen, setScriptureOpen] = useState(false);

  const [question, setQuestion] = useState<ApiQuestion | null>(null);
  const [answers, setAnswers] = useState<ApiAnswer[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const q = await fetchTodayQuestion();
        setQuestion(q);
        setAnswers(await fetchAnswers(q.id));
      } catch {
        /* leave the QotD teaser empty if the API is unreachable */
      }
    })();
  }, []);

  const previewAnswers = answers.slice(0, 2);

  function requireAuth(then: () => void) {
    if (user) then();
    else setShowAuth(true);
  }

  return (
    <div className="min-h-screen bg-ink text-parchment">

      {/* ── Hero: The Original Script + Question of the Day ── */}
      {/* min-h subtracts the TopNav (~118px) so the whole hero fits the first viewport */}
      <section className="relative overflow-hidden border-b border-parchment/10 px-6 min-h-[calc(100svh-118px)] flex flex-col items-center justify-center pt-5 pb-10">
        {/* Layered radial glows — depth behind the whole hero */}
        <div
          className="pointer-events-none absolute left-1/2 -top-32 -translate-x-1/2 w-[1100px] h-[1100px] opacity-[0.11]"
          style={{ background: "radial-gradient(circle, rgb(var(--color-gold)) 0%, transparent 58%)" }}
        />
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 w-[700px] h-[700px] opacity-[0.07]"
          style={{ background: "radial-gradient(circle, rgb(var(--color-ember)) 0%, transparent 62%)" }}
        />

        {/* Drifting Hebrew words — ambience, hidden from screen readers */}
        {HERO_GLYPHS.map((g) => (
          <span
            key={g.word}
            aria-hidden
            dir="rtl"
            className="pointer-events-none absolute select-none text-gold hidden md:block"
            style={{
              top: g.top,
              left: g.left,
              fontSize: g.size,
              fontFamily: "'Frank Ruhl Libre', serif",
              opacity: 0.07,
              animation: `os-drift ${g.dur} ease-in-out ${g.delay} infinite alternate`,
            }}
          >
            {g.word}
          </span>
        ))}

        <motion.div
          variants={heroStagger}
          initial="hidden"
          animate="show"
          className="relative max-w-6xl mx-auto text-center w-full"
        >
          {/* Title block */}
          <motion.div variants={heroRise} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/25 bg-gold/[0.06] text-gold text-xs mb-4 tracking-[0.18em] uppercase">
            📜 Faith-Deepening · Scriptural Intelligence · Non-Profit
          </motion.div>

          <motion.h1
            variants={heroRise}
            className="font-serif text-parchment leading-[1.04] tracking-[-0.03em] mb-3 text-[2.6rem] sm:text-5xl md:text-6xl"
          >
            The{" "}
            <span
              className="text-gold"
              style={{ textShadow: "0 0 60px rgba(212,175,90,0.35)" }}
            >
              Original Script
            </span>
          </motion.h1>

          <motion.p variants={heroRise} className="text-parchment/50 text-base max-w-xl mx-auto mb-6 leading-relaxed">
            Scripture as it was written. In the language it was spoken.
            With the depth it was meant to carry.
          </motion.p>

          {/* Split hero: question left, living community right */}
          <motion.div
            variants={heroRise}
            className="grid md:grid-cols-[1.2fr_0.8fr] gap-5 text-left max-w-5xl mx-auto items-stretch"
          >
            {/* Question of the Day — the hook, elevated off the dark */}
            <div
              className="relative rounded-[26px] border border-gold/15 bg-slate/10 px-7 pt-7 pb-6 sm:px-9 flex flex-col"
              style={{
                boxShadow:
                  "0 1px 0 rgba(212,175,90,0.08) inset, 0 40px 80px -20px rgba(0,0,0,0.55), 0 0 0 1px rgba(212,175,90,0.04)",
              }}
            >
              <div className="flex items-center gap-3 mb-5 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-gold/15 text-gold text-xs tracking-wider uppercase">
                  ✦ Question of the Day
                </span>
                <span className="text-parchment/30 text-xs">
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              <p className="font-serif text-parchment text-[1.3rem] sm:text-[1.45rem] leading-[1.36] tracking-[-0.015em] mb-5">
                {question?.text ?? "Loading today's question…"}
              </p>

              <button
                onClick={() => setScriptureOpen(!scriptureOpen)}
                className="flex items-center gap-3 text-left w-full mb-5 py-2 group"
              >
                <span className="w-0.5 h-6 bg-gold/40 rounded-full flex-shrink-0" />
                <span className="text-gold/70 text-sm italic font-serif group-hover:text-gold transition-colors">
                  {question?.scripture.reference}
                </span>
                <span className="text-parchment/30 text-xs ml-auto">
                  {scriptureOpen ? "hide" : "read passage"}
                </span>
              </button>
              {scriptureOpen && (
                <div className="-mt-2 mb-5 pl-5 border-l border-gold/20">
                  <p className="text-parchment/60 text-sm italic leading-relaxed">
                    {question?.scripture.passage ? `"${question.scripture.passage}"` : question?.scripture.reference}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between flex-wrap gap-4 pt-5 mt-auto border-t border-parchment/[0.08]">
                <span className="text-parchment/30 text-xs">
                  {answers.length} reflections shared today
                </span>
                <div className="flex items-center gap-3 flex-wrap">
                  {/* No requireAuth — Codex Ch1 is free for everyone */}
                  <button
                    onClick={() => navigate("/codex")}
                    className="px-5 py-3 border border-gold/25 text-gold/80 text-xs font-semibold rounded-xl hover:border-gold hover:text-gold hover:-translate-y-0.5 active:translate-y-0 transition-transform uppercase tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  >
                    📜 Open the Codex
                  </button>
                  <button
                    onClick={() => requireAuth(() => navigate("/question"))}
                    className="px-6 py-3 bg-gold text-ink font-semibold rounded-xl hover:bg-gold-light hover:-translate-y-0.5 active:translate-y-0 transition-transform text-xs uppercase tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                    style={{ boxShadow: "0 12px 30px -8px rgba(212,175,90,0.35)" }}
                  >
                    {user ? "Answer Today's Question →" : "Sign In to Answer →"}
                  </button>
                </div>
              </div>
            </div>

            {/* Community rail — what people are saying, right now */}
            <div className="rounded-[26px] border border-parchment/10 bg-slate/[0.07] px-6 pt-6 pb-5 flex flex-col">
              <p className="text-parchment/40 text-xs uppercase tracking-[0.18em] mb-5">
                Community Reflections
              </p>
              <div className="space-y-4 flex-1">
                {previewAnswers.map((ans) => (
                  <div key={ans.id} className="pb-4 border-b border-parchment/[0.07] last:border-0">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-7 h-7 rounded-full bg-gold/15 flex items-center justify-center text-xs text-gold font-bold flex-shrink-0">
                        {ans.userName.charAt(0)}
                      </div>
                      <span className="text-parchment/80 text-sm font-medium">{ans.userName}</span>
                      <span className="ml-auto text-parchment/30 text-xs">{ans.timeAgo}</span>
                    </div>
                    <p className="text-parchment/70 text-sm leading-[1.65] line-clamp-3">{ans.answer}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => requireAuth(() => navigate("/question"))}
                className="mt-4 text-gold/60 text-xs uppercase tracking-wider text-left hover:text-gold transition-colors py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                {user ? "Read all reflections →" : "Sign in to join the conversation →"}
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <div
          className="absolute bottom-2.5 left-1/2 -translate-x-1/2 text-parchment/25 text-xs tracking-[0.2em] uppercase"
          style={{ animation: "os-bob 2.2s ease-in-out infinite" }}
        >
          Scroll ↓
        </div>

        <style>{`
          @keyframes os-drift { from { transform: translateY(0px); } to { transform: translateY(-22px); } }
          @keyframes os-bob { 0%,100% { transform: translate(-50%, 0); opacity: 0.55; } 50% { transform: translate(-50%, 6px); opacity: 1; } }
          @media (prefers-reduced-motion: reduce) {
            [style*="os-drift"], [style*="os-bob"] { animation: none !important; }
          }
        `}</style>
      </section>

      {/* ── Secondary hook: Archaeological Artifact of the Day (asymmetric split) ── */}
      <section className="border-b border-parchment/10 py-16 px-6 bg-slate/5">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[0.85fr_1.15fr] gap-10 items-center">
          {/* Artifact image placeholder */}
          <div className="relative aspect-[4/5] md:aspect-auto md:h-full rounded-2xl border border-parchment/10 overflow-hidden bg-slate/20 flex flex-col items-center justify-center">
            <p className="text-7xl mb-3">🏛</p>
            <p className="text-parchment/20 text-xs absolute bottom-3 left-4">
              Wikimedia Commons · Public Domain
            </p>
          </div>

          {/* Content */}
          <div>
            <p className="text-parchment/30 text-xs uppercase tracking-[0.2em] mb-3">
              — Archaeological Artifact of the Day —
            </p>
            <p className="text-gold/60 text-xs uppercase tracking-widest mb-2">
              🏛 {mockArtifact.period}
            </p>
            <h3 className="text-parchment font-serif text-2xl sm:text-[1.75rem] font-bold mb-4 leading-snug tracking-[-0.01em]">
              {mockArtifact.title}
            </h3>
            <p className="text-parchment/50 text-sm leading-relaxed mb-5">
              {mockArtifact.description}
            </p>

            <div className="border border-parchment/10 rounded-xl p-4 bg-slate/20 mb-5">
              <p className="text-gold/60 text-xs uppercase tracking-widest mb-2">
                Biblical Correlation
              </p>
              <p className="text-parchment/50 text-sm leading-relaxed">
                {mockArtifact.correlation}
              </p>
            </div>

            <div className="mb-4">
              <p className="text-parchment/30 text-xs uppercase tracking-widest mb-3">
                Key Hebrew Terms
              </p>
              <div className="flex flex-wrap gap-3">
                {mockArtifact.hebrewTerms.map((t) => (
                  <div
                    key={t.word}
                    className="border border-gold/20 rounded-lg px-3 py-1.5 bg-gold/5"
                  >
                    <span
                      className="text-gold text-base mr-2"
                      style={{ fontFamily: "'Frank Ruhl Libre', serif" }}
                      dir="rtl"
                    >
                      {t.word}
                    </span>
                    <span className="text-parchment/40 text-xs">({t.transliteration})</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-parchment/20 text-xs">{mockArtifact.source}</p>
          </div>
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section className="py-16 px-6 border-b border-parchment/10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif text-parchment mb-3">The Maze</h2>
          <p className="text-parchment/40 text-base">
            Two pathways into the original text.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {/* Codex — no auth required, Ch1 is free */}
          <button
            onClick={() => navigate("/codex")}
            className="border border-parchment/10 rounded-2xl p-7 text-left hover:border-gold/40 transition-all group bg-slate/10"
          >
            <div className="w-11 h-11 rounded-xl bg-gold/20 flex items-center justify-center text-xl mb-5">
              📜
            </div>
            <h3 className="text-parchment font-serif text-xl mb-2 group-hover:text-gold transition-colors">
              The Codex
            </h3>
            <p className="text-parchment/40 text-sm leading-relaxed mb-4">
              Read Genesis in English, Malayalam and Hebrew. Tap each Hebrew word for root
              meanings and etymology. Chapter 1 is free — login to continue deeper.
            </p>
            <span className="text-gold/50 text-xs uppercase tracking-wider">
              Chapter 1 Free · Login for More →
            </span>
          </button>

          {/* Profile */}
          <button
            onClick={() => requireAuth(() => navigate("/profile"))}
            className="border border-parchment/10 rounded-2xl p-7 text-left hover:border-gold/40 transition-all group bg-slate/10"
          >
            <div className="w-11 h-11 rounded-xl bg-gold/20 flex items-center justify-center text-xl mb-5">
              ◎
            </div>
            <h3 className="text-parchment font-serif text-xl mb-2 group-hover:text-gold transition-colors">
              My Journey
            </h3>
            <p className="text-parchment/40 text-sm leading-relaxed mb-4">
              Track your 30-day answer history, build daily streaks, and see your growth
              across questions and chapters over time.
            </p>
            {!user ? (
              <span className="text-parchment/20 text-xs border border-parchment/10 rounded px-2 py-1">
                Login to unlock
              </span>
            ) : (
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
            <div className="text-sm flex flex-col items-start">
              <button
                onClick={() => navigate("/codex")}
                className="text-parchment/40 hover:text-gold transition-colors py-1.5"
              >
                Enter the Codex
              </button>
              <button
                onClick={() => navigate("/question")}
                className="text-parchment/40 hover:text-gold transition-colors py-1.5"
              >
                Today's Question
              </button>
              <button
                onClick={() => requireAuth(() => navigate("/profile"))}
                className="text-parchment/40 hover:text-gold transition-colors py-1.5"
              >
                My Journey
              </button>
            </div>
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