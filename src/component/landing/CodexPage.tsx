import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { genesis } from "../data/codexData";
import { useAuth } from "../../context/AuthContext";
import VerseCard from "../codex/VerseCard";
export default function CodexPage() {
  const [searchParams] = useSearchParams();
  const [currentChapter, setCurrentChapter] = useState(() => {
    const ch = searchParams.get("chapter");
    return ch ? parseInt(ch) - 1 : 0;
  });
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const chapter = genesis[currentChapter];
  const isCompleted = completed.has(currentChapter);

  function markComplete() {
    setCompleted((prev) => new Set([...prev, currentChapter]));
  }

  // Gate — chapter 2+ requires auth
  if (currentChapter > 0 && !user) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <p className="text-5xl mb-4">📜</p>
          <h2 className="text-2xl font-serif text-parchment mb-3">
            Continue Your Journey
          </h2>
          <p className="text-parchment/50 text-sm mb-2">
            You've completed Genesis Chapter 1.
          </p>
          <p className="text-parchment/50 text-sm mb-8">
            Create a free account to unlock Chapter 2 and beyond — your progress
            will be saved across devices.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/auth")}
              className="w-full py-4 bg-gold text-ink font-semibold rounded hover:bg-gold-light transition-all text-sm uppercase tracking-wide"
            >
              Create Free Account
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="w-full py-3 border border-parchment/20 text-parchment/60 rounded hover:border-gold hover:text-gold transition-all text-sm"
            >
              Sign In
            </button>
            <button
              onClick={() => setCurrentChapter(0)}
              className="text-parchment/30 text-xs hover:text-parchment transition-colors mt-2"
            >
              ← Back to Chapter 1
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-ink/90 backdrop-blur border-b border-gold/10 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="text-parchment/50 hover:text-parchment text-sm transition-colors"
        >
          ← Back
        </button>
        <div className="text-center">
          <p className="text-gold font-serif font-bold">The Codex</p>
          <p className="text-parchment/40 text-xs">
            Genesis · Chapter {chapter.number}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-parchment/30 text-xs hidden sm:block">
                {user.email}
              </span>
              <button
                onClick={signOut}
                className="text-parchment/30 hover:text-parchment text-xs transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/auth")}
              className="text-gold text-xs hover:underline"
            >
              Sign in
            </button>
          )}
        </div>
      </div>

      {/* Chapter navigation */}
      <div className="pt-20 max-w-5xl mx-auto px-4">
        <div className="flex gap-2 mb-8 overflow-x-auto py-2">
          {genesis.map((ch, i) => {
            const locked = i > 0 && !user;
            return (
              <button
                key={ch.number}
                onClick={() => !locked && setCurrentChapter(i)}
                disabled={locked}
                className={`px-4 py-2 rounded text-sm whitespace-nowrap transition-all border ${
                  currentChapter === i
                    ? "border-gold bg-gold/10 text-gold"
                    : locked
                    ? "border-parchment/5 text-parchment/20 cursor-not-allowed"
                    : completed.has(i)
                    ? "border-parchment/20 text-parchment/50 hover:border-gold/30"
                    : "border-parchment/10 text-parchment/40 hover:border-parchment/30"
                }`}
              >
                {locked ? "🔒 " : completed.has(i) ? "✓ " : ""}
                Chapter {ch.number}
              </button>
            );
          })}
        </div>

        {/* Chapter header */}
        <div className="text-center mb-12">
          <p className="text-gold/60 text-xs uppercase tracking-widest mb-2">
            Genesis
          </p>
          <h1 className="text-4xl font-serif text-parchment">
            Chapter {chapter.number}
          </h1>
        </div>

        {/* Verses */}
        {chapter.verses.map((verse) => (
          <VerseCard key={verse.number} verse={verse} />
        ))}

        {/* Completion */}
        {!isCompleted ? (
          <div className="text-center mt-12 pb-16">
            <button
              onClick={markComplete}
              className="px-8 py-4 bg-gold text-ink font-semibold rounded hover:bg-gold-light transition-all text-sm uppercase tracking-wide"
            >
              Mark Chapter Complete
            </button>
            <p className="text-parchment/30 text-xs mt-3">
              Completing this chapter unlocks Conquest Mode for Chapter {chapter.number}
            </p>
          </div>
        ) : (
          <div className="text-center mt-12 pb-16 border border-gold/30 rounded-xl p-8 bg-gold/5 mb-8">
            <p className="text-3xl mb-3">✓</p>
            <h3 className="text-gold font-serif text-xl mb-2">
              Chapter {chapter.number} Complete
            </h3>
            <p className="text-parchment/60 text-sm mb-6">
              Conquest Mode for this chapter is now unlocked.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate("/conquest")}
                className="px-8 py-3 bg-gold text-ink font-semibold rounded hover:bg-gold-light transition-all text-sm uppercase tracking-wide"
              >
                Enter Conquest Mode →
              </button>
              {currentChapter < genesis.length - 1 && (
                <button
                  onClick={() => {
                    if (!user) {
                      navigate("/auth");
                    } else {
                      setCurrentChapter(currentChapter + 1);
                    }
                  }}
                  className="px-8 py-3 border border-parchment/20 text-parchment/60 rounded hover:border-gold hover:text-gold transition-all text-sm"
                >
                  Next Chapter →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}