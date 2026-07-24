import { useState } from "react";
import { supabase } from "../lib/supabase";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ onClose, onSuccess }: Props) {
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = mode === "signup"
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else onSuccess();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-ink border border-parchment/10 rounded-t-2xl sm:rounded-2xl p-8 pb-12 sm:pb-8">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-11 h-11 flex items-center justify-center text-parchment/30 hover:text-parchment text-xl"
        >
          ✕
        </button>
        <h2 className="text-2xl font-serif text-parchment mb-1">
          {mode === "signup" ? "Join Original Script" : "Welcome Back"}
        </h2>
        <p className="text-parchment/40 text-sm mb-6">
          {mode === "signup" ? "Create your free account to continue" : "Sign in to your account"}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-slate/20 border border-parchment/10 rounded-lg px-4 py-3 text-parchment placeholder-parchment/30 focus:outline-none focus:border-gold/40 text-sm"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-slate/20 border border-parchment/10 rounded-lg px-4 py-3 text-parchment placeholder-parchment/30 focus:outline-none focus:border-gold/40 text-sm"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gold text-ink font-semibold rounded-lg hover:bg-gold-light transition-all text-sm uppercase tracking-wide disabled:opacity-50"
          >
            {loading ? "..." : mode === "signup" ? "Create Account" : "Sign In"}
          </button>
        </form>
        <p className="text-center text-parchment/30 text-xs mt-5">
          {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
          <button
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            className="text-gold hover:underline py-2 px-1 -my-2"
          >
            {mode === "signup" ? "Sign in" : "Create account"}
          </button>
        </p>
      </div>
    </div>
  );
}