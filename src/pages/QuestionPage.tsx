import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import {
  fetchTodayQuestion,
  fetchAnswers,
  fetchMyAnswer,
  postAnswer,
  postReply,
  type ApiQuestion,
  type ApiAnswer,
} from "../lib/api";
import AuthModal from "../component/AuthModal";
import ProfileCard from "../component/ProfileCard";

const PATHWAY_COLORS: Record<string, string> = {
  "wisdom-seeker":    "bg-gold/20 text-gold/80",
  "serious-learner":  "bg-indigo-400/20 text-indigo-300",
  "theology-student": "bg-ember/20 text-ember/80",
  "church-leader":    "bg-violet-400/20 text-violet-300",
};

const PATHWAY_LABELS: Record<string, string> = {
  "wisdom-seeker":    "Wisdom Seeker",
  "serious-learner":  "Serious Learner",
  "theology-student": "Theology Student",
  "church-leader":    "Church Leader",
};

export default function QuestionPage() {
  const { user } = useAuth();

  // Backend-driven data (replaces the old mock imports).
  const [question, setQuestion] = useState<ApiQuestion | null>(null);
  const [answers, setAnswers] = useState<ApiAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [screen, setScreen] = useState<"question" | "feed">("question");
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [modelAnswer, setModelAnswer] = useState<string | null>(null);
  const [scriptureOpen, setScriptureOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showAuth, setShowAuth] = useState(false);

  const loadAnswers = useCallback(async (questionId: string) => {
    try {
      setAnswers(await fetchAnswers(questionId));
    } catch {
      /* non-fatal: keep whatever we have */
    }
  }, []);

  // Load today's question + its answers on mount.
  useEffect(() => {
    (async () => {
      try {
        const q = await fetchTodayQuestion();
        setQuestion(q);
        await loadAnswers(q.id);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load today's question.");
      } finally {
        setLoading(false);
      }
    })();
  }, [loadAnswers]);

  // If the signed-in user has already answered today's question, show their saved
  // answer + the revealed model answer on load (instead of an empty input box).
  useEffect(() => {
    if (!user || !question) return;
    let cancelled = false;
    (async () => {
      try {
        const mine = await fetchMyAnswer(question.id);
        if (!cancelled && mine.answered) {
          setAnswer(mine.answer ?? "");
          setModelAnswer(mine.modelAnswer ?? null);
          setSubmitted(true);
        }
      } catch {
        /* ignore — fall back to the input */
      }
    })();
    return () => { cancelled = true; };
  }, [user, question]);

  function requireAuth(then: () => void) {
    if (user) then();
    else setShowAuth(true);
  }

  async function handleSubmit() {
    if (!answer.trim() || !question) return;
    setError(null);
    try {
      const created = await postAnswer(question.id, answer.trim());
      setModelAnswer(created.modelAnswer ?? null);
      setSubmitted(true);
      await loadAnswers(question.id);
      setScreen("feed");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not submit your answer.");
    }
  }

  async function handleReplySubmit(answerId: string) {
    if (!replyText.trim()) return;
    setError(null);
    try {
      await postReply(answerId, replyText.trim());
      setReplyText("");
      setReplyingTo(null);
      if (question) await loadAnswers(question.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not post your reply.");
    }
  }

  const communityCount = answers.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-ink text-parchment flex items-center justify-center">
        <p className="text-parchment/40 text-sm">Loading today's question…</p>
      </div>
    );
  }

  if (error && !question) {
    return (
      <div className="min-h-screen bg-ink text-parchment flex items-center justify-center px-5">
        <p className="text-ember/70 text-sm text-center">{error}</p>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="min-h-screen bg-ink text-parchment pb-10">

      {/* ── Question screen ── */}
      {screen === "question" && (
        <div className="max-w-2xl mx-auto px-5 py-10">

          {/* Date + label */}
          <div className="flex items-center gap-3 mb-8">
            <span className="px-3 py-1 rounded-full bg-gold/20 text-gold text-xs tracking-wider uppercase">
              Question of the Day
            </span>
            <span className="text-parchment/30 text-xs">
              {new Date(question.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
          </div>

          {/* Question */}
          <p className="text-parchment font-serif text-2xl leading-relaxed mb-6">
            {question.text}
          </p>

          {/* Scripture accordion */}
          <button
            onClick={() => setScriptureOpen(!scriptureOpen)}
            className="flex items-center gap-3 text-left w-full mb-6 py-2"
          >
            <span className="w-0.5 h-5 bg-gold/40 rounded-full" />
            <span className="text-gold/70 text-sm italic font-serif">{question.scripture.reference}</span>
            <span className="text-parchment/30 text-xs ml-auto">
              {scriptureOpen ? "hide" : "read passage"}
            </span>
          </button>
          {scriptureOpen && (
            <div className="mb-6 pl-5 border-l border-gold/20">
              <p className="text-parchment/60 text-sm italic leading-relaxed">
                {question.scripture.passage ? `"${question.scripture.passage}"` : question.scripture.reference}
              </p>
            </div>
          )}

          {/* Community count teaser */}
          <p className="text-parchment/30 text-xs mb-4">
            🕊 {communityCount} people from your community have answered today
          </p>

          {error && <p className="text-ember/70 text-xs mb-3">{error}</p>}

          {/* Answer input or submitted state */}
          {submitted ? (
            <div className="mb-6 space-y-3">
              <div className="border border-gold/20 rounded-xl p-5 bg-gold/5">
                <p className="text-gold/60 text-xs uppercase tracking-widest mb-2">Your answer</p>
                <p className="text-parchment/70 text-sm leading-relaxed italic">"{answer}"</p>
              </div>
              {modelAnswer && (
                <div className="border border-parchment/15 rounded-xl p-5 bg-slate/10">
                  <p className="text-parchment/40 text-xs uppercase tracking-widest mb-2">From the passage</p>
                  <p className="text-parchment/60 text-sm leading-relaxed">{modelAnswer}</p>
                </div>
              )}
            </div>
          ) : user ? (
            <div className="mb-6">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="What do you think?"
                rows={5}
                className="w-full bg-slate/30 border border-parchment/15 rounded-xl p-4 text-parchment text-sm placeholder-parchment/30 resize-none focus:outline-none focus:border-gold/40 transition-colors"
              />
              <button
                onClick={handleSubmit}
                disabled={!answer.trim()}
                className="mt-3 w-full py-3.5 bg-gold text-ink font-semibold rounded-xl hover:bg-gold-light disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm uppercase tracking-wide"
              >
                Share with Community
              </button>
            </div>
          ) : (
            <div className="border border-parchment/10 rounded-xl p-5 text-center mb-6">
              <p className="text-parchment/40 text-sm mb-3">Sign in to share your reflection</p>
              <button
                onClick={() => setShowAuth(true)}
                className="px-6 py-2.5 border border-gold/30 text-gold text-sm rounded-lg hover:border-gold hover:bg-gold/10 transition-all"
              >
                Sign In →
              </button>
            </div>
          )}

          {/* See community link */}
          <button
            onClick={() => setScreen("feed")}
            className="w-full text-center text-parchment/30 text-sm hover:text-parchment transition-colors py-3"
          >
            See community reflections ({communityCount}) →
          </button>
        </div>
      )}

      {/* ── Community feed screen ── */}
      {screen === "feed" && (
        <div className="max-w-2xl mx-auto px-5 py-10">

          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-parchment font-serif text-xl">Community Reflections</h2>
            <button
              onClick={() => setScreen("question")}
              className="text-parchment/30 text-sm hover:text-parchment transition-colors"
            >
              ← Back
            </button>
          </div>

          {/* Community counter */}
          <p className="text-parchment/40 text-sm mb-6">
            🕊 <span className="text-parchment/60 font-medium">{communityCount} people</span> answered today
          </p>

          {error && <p className="text-ember/70 text-xs mb-3">{error}</p>}

          {/* Your answer + the passage reveal (once you've answered) */}
          {submitted && (
            <div className="mb-4 space-y-3">
              <div className="border border-gold/20 rounded-xl p-5 bg-gold/5">
                <p className="text-gold/60 text-xs uppercase tracking-widest mb-2">Your answer</p>
                <p className="text-parchment/70 text-sm leading-relaxed italic">"{answer}"</p>
              </div>
              {modelAnswer && (
                <div className="border border-parchment/15 rounded-xl p-5 bg-slate/10">
                  <p className="text-parchment/40 text-xs uppercase tracking-widest mb-2">From the passage</p>
                  <p className="text-parchment/60 text-sm leading-relaxed">{modelAnswer}</p>
                </div>
              )}
            </div>
          )}

          {/* Community answers */}
          <div className="space-y-3">
            {answers.map((ans) => {
              const pathway = ans.pathway;
              const isReplying = replyingTo === ans.id;

              return (
                <div key={ans.id} className="border border-parchment/10 rounded-xl p-5 bg-slate/10">

                  {/* Header row: profile card chip + time */}
                  <div className="flex items-center justify-between mb-3">
                    <ProfileCard
                      userId={ans.userId}
                      name={ans.userName}
                      pathway={pathway}
                      level="Seeker"
                      compact
                    />
                    <span className="text-parchment/20 text-xs shrink-0 ml-2">{ans.timeAgo}</span>
                  </div>

                  {/* Pathway badge */}
                  {pathway && (
                    <div className="mb-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${PATHWAY_COLORS[pathway] ?? "bg-parchment/10 text-parchment/50"}`}>
                        {PATHWAY_LABELS[pathway] ?? pathway}
                      </span>
                    </div>
                  )}

                  {/* Answer text */}
                  <p className="text-parchment/70 text-sm leading-relaxed mb-4">{ans.answer}</p>

                  {/* Existing replies */}
                  {ans.replies.length > 0 && (
                    <div className="pl-4 border-l border-gold/20 space-y-2 mb-3">
                      {ans.replies.map((r) => (
                        <div key={r.id}>
                          <p className="text-parchment/40 text-xs">
                            {r.userName} <span className="text-parchment/20">· {r.timeAgo}</span>
                          </p>
                          <p className="text-parchment/60 text-sm italic">"{r.text}"</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply input / button */}
                  {isReplying ? (
                    <div className="mt-2">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        rows={2}
                        className="w-full bg-slate/30 border border-parchment/15 rounded-lg p-3 text-parchment text-sm placeholder-parchment/30 resize-none focus:outline-none focus:border-gold/40 transition-colors"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleReplySubmit(ans.id)}
                          disabled={!replyText.trim()}
                          className="px-4 py-2 bg-gold text-ink text-xs font-semibold rounded-lg hover:bg-gold-light disabled:opacity-40 transition-all"
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => { setReplyingTo(null); setReplyText(""); }}
                          className="px-4 py-2 text-parchment/30 text-xs hover:text-parchment transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => requireAuth(() => setReplyingTo(ans.id))}
                      className="text-xs text-parchment/30 hover:text-gold transition-colors py-2.5 px-1 -mx-1"
                    >
                      {user ? "Reply →" : "🔒 Sign in to reply →"}
                    </button>
                  )}
                </div>
              );
            })}

            {answers.length === 0 && (
              <p className="text-parchment/30 text-sm text-center py-6">
                No reflections yet — be the first to answer.
              </p>
            )}
          </div>

          {/* Answer CTA if not yet submitted */}
          {!submitted && (
            <div className="mt-6 border border-dashed border-parchment/15 rounded-xl p-5 text-center">
              <p className="text-parchment/40 text-sm mb-3">Share your own reflection</p>
              {user ? (
                <button
                  onClick={() => setScreen("question")}
                  className="px-6 py-2.5 bg-gold text-ink text-sm font-semibold rounded-lg hover:bg-gold-light transition-all"
                >
                  Answer Today's Question →
                </button>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="px-6 py-2.5 border border-gold/30 text-gold text-sm rounded-lg hover:bg-gold/10 transition-all"
                >
                  Sign In to Answer →
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={() => setShowAuth(false)}
        />
      )}
    </div>
  );
}
