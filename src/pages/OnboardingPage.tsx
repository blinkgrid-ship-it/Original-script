import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { pathways, communities } from "../data/onboardingData";
import { useAuth } from "../context/AuthContext";

type Step = 1 | 2 | 3 | 4;

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { signUp, signIn } = useAuth();
  const [step, setStep] = useState<Step>(1);
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  const [customCommunity, setCustomCommunity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"signup" | "signin">("signup");

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (mode === "signup") {
      const { error } = await signUp(email, password);
      if (error) { setError(error); setLoading(false); return; }
      navigate("/question");
    } else {
      const { error } = await signIn(email, password);
      if (error) { setError(error); setLoading(false); return; }
      navigate("/question");
    }
    setLoading(false);
  }

  // Progress bar
  const progress = ((step - 1) / 3) * 100;

  return (
    <div className="min-h-screen bg-ink flex flex-col">
      {/* Progress bar */}
      {step > 1 && (
        <div className="h-0.5 bg-parchment/10">
          <div
            className="h-full bg-gold transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Screen 1 — Welcome */}
      {step === 1 && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="max-w-sm">
            <p className="text-gold/60 text-xs uppercase tracking-[0.3em] mb-8">
              Original Script
            </p>
            <div className="mb-10 space-y-4">
              <div className="border border-gold/20 rounded-xl p-5">
                <p className="text-gold font-serif text-2xl mb-1">The Light</p>
                <p className="text-parchment/50 text-sm">
                  God — infinite, undivided, source of all truth.
                </p>
              </div>
              <div className="border border-parchment/10 rounded-xl p-5">
                <p className="text-parchment font-serif text-2xl mb-1">The Film</p>
                <p className="text-parchment/50 text-sm">
                  The Bible — written by humans, in human history.
                </p>
              </div>
              <div className="border border-parchment/10 rounded-xl p-5">
                <p className="text-parchment/70 font-serif text-2xl mb-1">Your Colors</p>
                <p className="text-parchment/50 text-sm">
                  Your denomination — the color you see on the screen.
                </p>
              </div>
            </div>
            <p className="text-parchment/40 text-sm mb-8">
              Original Script helps you understand your film better.
            </p>
            <button
              onClick={() => setStep(2)}
              className="w-full py-4 bg-gold text-ink font-semibold rounded hover:bg-gold-light transition-all text-sm uppercase tracking-wide"
            >
              Begin Your Journey
            </button>
            <button
              onClick={() => { setMode("signin"); setStep(4); }}
              className="mt-4 text-parchment/30 text-xs hover:text-parchment transition-colors block mx-auto"
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>
      )}

      {/* Screen 2 — Pathway */}
      {step === 2 && (
        <div className="flex-1 flex flex-col px-6 py-12 max-w-lg mx-auto w-full">
          <h1 className="font-serif text-3xl text-parchment mb-2">
            Who are you?
          </h1>
          <p className="text-parchment/40 text-sm mb-8">
            This becomes your identity badge in the community.
          </p>
          <div className="space-y-3 flex-1">
            {pathways.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPathway(p.id)}
                className={`w-full flex items-center gap-4 p-5 rounded-xl border text-left transition-all ${
                  selectedPathway === p.id
                    ? "border-gold bg-gold/10"
                    : "border-parchment/10 hover:border-parchment/30"
                }`}
              >
                <span className="text-3xl shrink-0">{p.icon}</span>
                <div>
                  <p className={`font-serif text-lg ${selectedPathway === p.id ? "text-gold" : "text-parchment"}`}>
                    {p.title}
                  </p>
                  <p className="text-parchment/40 text-sm mt-0.5">{p.description}</p>
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={() => selectedPathway && setStep(3)}
            disabled={!selectedPathway}
            className="mt-8 w-full py-4 bg-gold text-ink font-semibold rounded hover:bg-gold-light transition-all text-sm uppercase tracking-wide disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      )}

      {/* Screen 3 — Community */}
      {step === 3 && (
        <div className="flex-1 flex flex-col px-6 py-12 max-w-lg mx-auto w-full">
          <h1 className="font-serif text-3xl text-parchment mb-2">
            Your community
          </h1>
          <p className="text-parchment/40 text-sm mb-8">
            Your answers will be visible to people from your church.
          </p>
          <div className="space-y-2 mb-6">
            {communities.map((c) => (
              <button
                key={c}
                onClick={() => { setSelectedCommunity(c); setCustomCommunity(""); }}
                className={`w-full px-4 py-3 rounded-lg border text-left text-sm transition-all ${
                  selectedCommunity === c
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-parchment/10 text-parchment/60 hover:border-parchment/30"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Type your church name..."
              value={customCommunity}
              onChange={(e) => {
                setCustomCommunity(e.target.value);
                setSelectedCommunity(null);
              }}
              className="w-full px-4 py-3 bg-ink border border-parchment/20 rounded-lg text-parchment placeholder-parchment/30 focus:outline-none focus:border-gold text-sm"
            />
          </div>
          <button
            onClick={() => setSelectedCommunity("solo")}
            className={`w-full px-4 py-3 rounded-lg border text-left text-sm transition-all mb-8 ${
              selectedCommunity === "solo"
                ? "border-gold bg-gold/10 text-gold"
                : "border-parchment/10 text-parchment/40 hover:border-parchment/30"
            }`}
          >
            🌍 I'm exploring on my own
          </button>
          <button
            onClick={() => (selectedCommunity || customCommunity) && setStep(4)}
            disabled={!selectedCommunity && !customCommunity}
            className="w-full py-4 bg-gold text-ink font-semibold rounded hover:bg-gold-light transition-all text-sm uppercase tracking-wide disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      )}

      {/* Screen 4 — Auth */}
      {step === 4 && (
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="max-w-sm w-full">
            <h1 className="font-serif text-3xl text-parchment mb-2 text-center">
              {mode === "signup" ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-parchment/40 text-sm mb-8 text-center">
              {mode === "signup"
                ? "Your journey and community answers will be saved."
                : "Sign in to continue your journey."}
            </p>
            <form onSubmit={handleAuth} className="space-y-4">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-ink border border-parchment/20 rounded text-parchment placeholder-parchment/30 focus:outline-none focus:border-gold text-sm"
              />
              <input
                type="password"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-ink border border-parchment/20 rounded text-parchment placeholder-parchment/30 focus:outline-none focus:border-gold text-sm"
              />
              {error && (
                <p className="text-red-400 text-xs text-center">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gold text-ink font-semibold rounded hover:bg-gold-light transition-all text-sm uppercase tracking-wide disabled:opacity-50"
              >
                {loading ? "Please wait..." : mode === "signup" ? "Create Account" : "Sign In"}
              </button>
            </form>
            <p className="text-center text-parchment/30 text-sm mt-6">
              {mode === "signup" ? "Already have an account? " : "Don't have an account? "}
              <button
                onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setError(null); }}
                className="text-gold hover:underline"
              >
                {mode === "signup" ? "Sign in" : "Sign up"}
              </button>
            </p>
            {mode === "signup" && step === 4 && (
              <button
                onClick={() => setStep(3)}
                className="mt-4 text-parchment/20 text-xs hover:text-parchment transition-colors block mx-auto"
              >
                ← Back
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}