import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTodayQuestion, mockAnswers } from "../data/questionData";
import type { Answer } from "../data/questionData";
import { useAuth } from "../context/AuthContext";

type Screen = "question" | "feed";

export default function QuestionPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const question = getTodayQuestion();
  const [screen, setScreen] = useState<Screen>("question");
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [passageOpen, setPassageOpen] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>(mockAnswers);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [repliedTo, setRepliedTo] = useState<Set<string>>(new Set());

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim()) return;
    const newAnswer: Answer = {
      id: `a-${Date.now()}`,
      questionId: question.id,
      userId: user?.id ?? "guest",
      userName: user?.email?.split("@")[0] ?? "You",
      pathway: "Wisdom Seeker",
      answer: answer.trim(),
      timeAgo: "Just now",
      replies: [],
    };
    setAnswers([newAnswer, ...answers]);
    setSubmitted(true);
    setScreen("feed");
  }

  function handleReply(answerId: string) {
    if (!replyText.trim()) return;
    setAnswers((prev) =>
      prev.map((a) =>
        a.id === answerId
          ? {
              ...a,
              replies: [
                ...a.replies,
                {
                  id: `r-${Date.now()}`,
                  userId: user?.id ?? "guest",
                  userName: user?.email?.split("@")[0] ?? "You",
                  text: replyText.trim(),
                  timeAgo: "Just now",
                },
              ],
            }
          : a
      )
    );
    setRepliedTo((prev) => new Set([...prev, answerId]));
    setReplyingTo(null);
    setReplyText("");
  }

  const pathwayColors: Record<string, string> = {
    "Wisdom Seeker": "bg-blue-900/40 text-blue-300",
    "Serious Learner": "bg-amber-900/40 text-amber-300",
    "Theology Student": "bg-purple-900/40 text-purple-300",
    "Church Leader": "bg-green-900/40 text-green-300",
  };

  return (
    <div className="min-h-screen bg-ink">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-ink/90 backdrop-blur border-b border-gold/10 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-gold font-serif font-bold text-lg">Original Script</p>
          <p className="text-parchment/30 text-xs">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {screen === "feed" && !submitted && (
            <button
              onClick={() => setScreen("question")}
              className="text-gold text-xs hover:underline"
            >
              Answer today's question
            </button>
          )}
          {user && (
            <button
              onClick={signOut}
              className="text-parchment/30 hover:text-parchment text-xs transition-colors"
            >
              Sign out
            </button>
          )}
        </div>
      </div>

      {/* Question Screen */}
      {screen === "question" && (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-10">
          <div className="max-w-xl w-full">
            {/* Question */}
            <p className="text-gold/60 text-xs uppercase tracking-widest mb-6 text-center">
              Question of the Day
            </p>
            <h1 className="font-serif text-2xl md:text-3xl text-parchment leading-relaxed text-center mb-6">
              {question.text}
            </h1>

            {/* Scripture */}
            <div className="mb-8">
              <button
                onClick={() => setPassageOpen(!passageOpen)}
                className="w-full flex items-center justify-between px-4 py-3 border border-parchment/10 rounded-lg hover:border-gold/20 transition-all"
              >
                <span className="text-gold/70 font-serif italic text-sm">
                  {question.scripture.reference}
                </span>
                <span className="text-parchment/30 text-xs">
                  {passageOpen ? "Hide passage" : "Show passage"}
                </span>
              </button>
              {passageOpen && (
                <div className="mt-2 px-4 py-4 border border-parchment/10 rounded-lg bg-slate/10">
                  <p className="text-parchment/60 font-serif italic text-sm leading-relaxed">
                    "{question.scripture.passage}"
                  </p>
                </div>
              )}
            </div>

            {/* Answer input */}
            <form onSubmit={handleSubmit}>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="What do you think?"
                rows={5}
                className="w-full px-4 py-4 bg-parchment/5 border border-parchment/20 rounded-xl text-parchment placeholder-parchment/30 focus:outline-none focus:border-gold font-sans text-sm resize-none mb-4"
              />
              <button
                type="submit"
                disabled={!answer.trim()}
                className="w-full py-4 bg-gold text-ink font-semibold rounded-xl hover:bg-gold-light transition-all text-sm uppercase tracking-wide disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Share with Community
              </button>
            </form>

            <button
              onClick={() => setScreen("feed")}
              className="w-full mt-3 text-parchment/30 text-xs hover:text-parchment transition-colors text-center"
            >
              See what others said first →
            </button>
          </div>
        </div>
      )}

      {/* Community Feed Screen */}
      {screen === "feed" && (
        <div className="max-w-xl mx-auto px-4 pt-24 pb-16">
          {submitted && (
            <div className="mb-6 p-4 border border-gold/30 rounded-xl bg-gold/5 text-center">
              <p className="text-gold font-serif">Your answer has been shared.</p>
              <p className="text-parchment/40 text-xs mt-1">
                Come back tomorrow for a new question.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-parchment font-serif text-xl">
              Community Answers
            </h2>
            <span className="text-parchment/30 text-xs">
              {answers.length} people answered today
            </span>
          </div>

          <div className="space-y-4">
            {answers.map((a) => (
              <div
                key={a.id}
                className="border border-parchment/10 rounded-xl p-5 hover:border-parchment/20 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-slate/50 flex items-center justify-center text-xs font-bold text-gold shrink-0">
                    {a.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-parchment text-sm font-medium">{a.userName}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${pathwayColors[a.pathway] ?? "bg-slate/30 text-parchment/50"}`}>
                      {a.pathway}
                    </span>
                  </div>
                  <span className="ml-auto text-parchment/20 text-xs">{a.timeAgo}</span>
                </div>

                <p className="text-parchment/70 text-sm leading-relaxed mb-4">
                  {a.answer}
                </p>

                {/* Replies */}
                {a.replies.length > 0 && (
                  <div className="ml-4 border-l border-parchment/10 pl-4 mb-3 space-y-2">
                    {a.replies.map((r) => (
                      <div key={r.id}>
                        <p className="text-parchment/50 text-xs font-medium mb-0.5">
                          {r.userName}
                        </p>
                        <p className="text-parchment/50 text-xs leading-relaxed">
                          {r.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply button */}
                {!repliedTo.has(a.id) && a.userId !== (user?.id ?? "guest") && (
                  <>
                    {replyingTo === a.id ? (
                      <div className="mt-2">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          rows={2}
                          className="w-full px-3 py-2 bg-ink border border-parchment/20 rounded-lg text-parchment/80 placeholder-parchment/30 focus:outline-none focus:border-gold text-xs resize-none mb-2"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReply(a.id)}
                            disabled={!replyText.trim()}
                            className="px-4 py-1.5 bg-gold text-ink text-xs font-semibold rounded hover:bg-gold-light transition-all disabled:opacity-30"
                          >
                            Reply
                          </button>
                          <button
                            onClick={() => { setReplyingTo(null); setReplyText(""); }}
                            className="px-4 py-1.5 text-parchment/30 text-xs hover:text-parchment transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReplyingTo(a.id)}
                        className="text-parchment/30 text-xs hover:text-gold transition-colors"
                      >
                        Reply →
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}