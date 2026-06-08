import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getTodayQuestion, mockAnswers } from "../data/questionData";
import AuthModal from "../component/AuthModal";
type Screen = "question" | "feed";

const pathwayColors: Record<string, string> = {
  "Wisdom Seeker": "text-amber-400 bg-amber-400/10 border-amber-400/20",
  "Serious Learner": "text-blue-400 bg-blue-400/10 border-blue-400/20",
  "Theology Student": "text-purple-400 bg-purple-400/10 border-purple-400/20",
  "Church Leader": "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
};

export default function QuestionPage() {
  const { user } = useAuth();
  const [screen, setScreen] = useState<Screen>("question");
  const [scriptureOpen, setScriptureOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const question = getTodayQuestion();

  function handleSubmit() {
    if (!user) {
      setShowAuth(true);
      return;
    }
    if (!answer.trim()) return;
    setSubmitted(true);
    setScreen("feed");
  }

  function handleReply(answerId: string) {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setReplyingTo(replyingTo === answerId ? null : answerId);
  }

  if (screen === "feed") {
    return (
      <div className="min-h-screen bg-ink pb-8">
        <div className="max-w-2xl mx-auto px-4 pt-6">
          {/* Back + question recap */}
          <button
            onClick={() => setScreen("question")}
            className="text-parchment/40 hover:text-parchment text-sm mb-5 block"
          >
            ← Back to question
          </button>

          <div className="border border-gold/10 rounded-xl p-4 mb-6 bg-gold/5">
            <p className="text-gold/60 text-xs uppercase tracking-widest mb-1">
              Today's Question
            </p>
            <p className="text-parchment/70 text-sm font-serif leading-relaxed">
              {question.text}
            </p>
            {submitted && answer.trim() && (
              <div className="mt-3 pt-3 border-t border-parchment/10">
                <p className="text-parchment/40 text-xs mb-1">Your reflection</p>
                <p className="text-parchment/60 text-sm italic">"{answer}"</p>
              </div>
            )}
          </div>

          <p className="text-parchment/30 text-xs uppercase tracking-widest mb-4">
            Community · {mockAnswers.length} reflections
          </p>

          <div className="space-y-4">
            {mockAnswers.map((ans) => (
              <div key={ans.id} className="border border-parchment/10 rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate/40 flex items-center justify-center text-xs text-gold font-bold shrink-0">
                      {ans.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-parchment text-sm font-medium">
                        {ans.userName}
                      </p>
                      <p className="text-parchment/30 text-xs">{ans.timeAgo}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded border ${
                      pathwayColors[ans.pathway] ??
                      "text-parchment/30 bg-parchment/5 border-parchment/10"
                    }`}
                  >
                    {ans.pathway}
                  </span>
                </div>

                <p className="text-parchment/70 text-sm leading-relaxed mb-3">
                  {ans.answer}
                </p>

                {/* Replies */}
                {ans.replies.length > 0 && (
                  <div className="ml-4 border-l border-parchment/10 pl-4 space-y-2 mb-3">
                    {ans.replies.map((reply) => (
                      <div key={reply.id}>
                        <p className="text-parchment/50 text-xs font-medium">
                          {reply.userName}
                        </p>
                        <p className="text-parchment/40 text-xs leading-relaxed">
                          {reply.text}
                        </p>
                        <p className="text-parchment/20 text-xs mt-0.5">
                          {reply.timeAgo}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply button */}
                <button
                  onClick={() => handleReply(ans.id)}
                  className="text-xs text-parchment/20 hover:text-gold transition-colors"
                >
                  {user
                    ? replyingTo === ans.id
                      ? "Cancel"
                      : "Reply →"
                    : "🔒 Sign in to reply →"}
                </button>

                {replyingTo === ans.id && user && (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      className="flex-1 bg-slate/20 border border-parchment/10 rounded-lg px-3 py-2 text-parchment placeholder-parchment/20 text-xs focus:outline-none focus:border-gold/40"
                    />
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText("");
                      }}
                      className="px-3 py-2 bg-gold text-ink text-xs font-semibold rounded-lg hover:bg-gold-light transition-all"
                    >
                      Post
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {showAuth && (
          <AuthModal
            onClose={() => setShowAuth(false)}
            onSuccess={() => setShowAuth(false)}
          />
        )}
      </div>
    );
  }

  // Question screen
  return (
    <div className="min-h-screen bg-ink pb-8">
      <div className="max-w-2xl mx-auto px-5 pt-6">
        {/* Question */}
        <div className="mb-6">
          <p className="text-gold/60 text-xs uppercase tracking-widest mb-3">
            Today's Question
          </p>
          <p className="text-parchment font-serif text-2xl leading-relaxed">
            {question.text}
          </p>
        </div>

        {/* Scripture */}
        <div className="border border-parchment/10 rounded-xl overflow-hidden mb-8">
          <button
            onClick={() => setScriptureOpen(!scriptureOpen)}
            className="w-full px-5 py-3 flex items-center justify-between hover:bg-slate/10 transition-all"
          >
            <span className="text-gold/60 text-xs uppercase tracking-widest">
              {question.scripture.reference}
            </span>
            <span className="text-parchment/30">{scriptureOpen ? "−" : "+"}</span>
          </button>
          {scriptureOpen && (
            <div className="px-5 py-4 bg-slate/10 border-t border-parchment/10">
              <p className="text-parchment/60 text-sm italic leading-relaxed">
                "{question.scripture.passage}"
              </p>
            </div>
          )}
        </div>

        {/* Answer */}
        <div className="mb-6">
          <p className="text-parchment/40 text-xs uppercase tracking-widest mb-3">
            Your Reflection
          </p>
          {user ? (
            <>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Take your time. There's no wrong answer here..."
                rows={6}
                className="w-full bg-slate/10 border border-parchment/10 rounded-xl px-5 py-4 text-parchment placeholder-parchment/20 text-sm leading-relaxed focus:outline-none focus:border-gold/30 resize-none"
              />
              <button
                onClick={handleSubmit}
                disabled={!answer.trim()}
                className="mt-4 w-full py-4 bg-gold text-ink font-semibold rounded-xl hover:bg-gold-light transition-all text-sm uppercase tracking-wide disabled:opacity-30"
              >
                Share with Community
              </button>
            </>
          ) : (
            <div className="border border-parchment/10 rounded-xl p-8 text-center">
              <p className="text-parchment/40 text-sm mb-4">
                Sign in to share your reflection and join the community discussion.
              </p>
              <button
                onClick={() => setShowAuth(true)}
                className="px-6 py-3 bg-gold text-ink font-semibold rounded-xl text-sm uppercase tracking-wide hover:bg-gold-light transition-all"
              >
                Sign In to Answer
              </button>
            </div>
          )}
        </div>

        {/* Peek at community */}
        <button
          onClick={() => setScreen("feed")}
          className="w-full py-3 text-center text-parchment/30 text-xs hover:text-parchment transition-colors border border-dashed border-parchment/10 rounded-xl"
        >
          See community reflections →
        </button>
      </div>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={() => setShowAuth(false)}
        />
      )}
    </div>
  );
}