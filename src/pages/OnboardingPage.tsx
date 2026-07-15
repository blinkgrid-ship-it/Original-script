import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { pathways } from "../data/onboardingData";
import { postPathway } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { markOnboarded } = useAuth();
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);

  async function handlePathwaySelect(pathwayId: string) {
    setSelectedPathway(pathwayId);
    localStorage.setItem("os_pathway", pathwayId);
    // Persist to the backend too (best-effort: needs the user signed in; localStorage
    // keeps the choice if the call fails so onboarding never blocks).
    try {
      await postPathway(pathwayId);
    } catch {
      /* not signed in / offline — fall back to localStorage */
    }
    markOnboarded(pathwayId);
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-ink px-6 py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <p className="text-gold/60 text-xs uppercase tracking-widest mb-2">Who are you?</p>
          <h2 className="text-3xl font-serif text-parchment">Choose your path</h2>
          <p className="text-parchment/40 text-sm mt-2">
            This shapes how we present Scripture to you.
          </p>
        </div>
        <div className="space-y-4">
          {pathways.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePathwaySelect(p.id)}
              className={`w-full border rounded-2xl p-5 text-left transition-all hover:border-gold/40 group ${
                selectedPathway === p.id
                  ? "border-gold bg-gold/5"
                  : "border-parchment/10"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{p.icon}</span>
                <div>
                  <p className="text-parchment font-serif text-base group-hover:text-gold transition-colors">
                    {p.title}
                  </p>
                  <p className="text-parchment/40 text-xs mt-0.5">{p.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}