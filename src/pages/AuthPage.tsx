import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Mode = "signin" | "signup";

export default function AuthPage() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === "signup") {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error);
      } else {
        setSignupSuccess(true);
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
      } else {
        navigate("/codex");
      }
    }
    setLoading(false);
  }

  if (signupSuccess) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-6">
        <div className="max-w-sm w-full text-center">
          <p className="text-5xl mb-4">✉️</p>
          <h2 className="text-2xl font-serif text-parchment mb-3">
            Check your email
          </h2>
          <p className="text-parchment/50 text-sm mb-6">
            We sent a confirmation link to <span className="text-gold">{email}</span>.
            Click it to activate your account, then sign in.
          </p>
          <button
            onClick={() => { setMode("signin"); setSignupSuccess(false); }}
            className="text-gold text-sm hover:underline"
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6">
      <div className="max-w-sm w-full">
        <div className="text-center mb-10">
          <button
            onClick={() => navigate("/")}
            className="text-parchment/30 hover:text-parchment text-sm mb-6 block mx-auto transition-colors"
          >
            ← Back
          </button>
          <p className="text-gold font-serif text-2xl font-bold mb-1">
            Original Script
          </p>
          <p className="text-parchment/40 text-sm">
            {mode === "signin" ? "Sign in to continue your journey" : "Create your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="Password"
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
            {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-parchment/30 text-sm mt-6">
          {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); }}
            className="text-gold hover:underline"
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}