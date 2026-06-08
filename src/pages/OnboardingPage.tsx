import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { pathways } from "../data/onboardingData";

type Screen = "welcome" | "pathway";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>("welcome");
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);

  function handlePathwaySelect(pathwayId: string) {
    setSelectedPathway(pathwayId);
    localStorage.setItem("os_pathway", pathwayId);
    navigate("/home");
  }

  if (screen === "welcome") {
    return (
      <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-sm">
          <p className="text-6xl mb-6">📽</p>
          <h1 className="text-4xl font-serif text-parchment mb-4 leading-tight">
            Original Script
          </h1>
          <p className="text-parchment/50 text-base leading-relaxed mb-12">
            Scripture as it was written. In the language it was spoken. With the depth it was meant to carry.
          </p>
          <button
            onClick={() => setScreen("pathway")}
            className="w-full py-4 bg-gold text-ink font-semibold rounded-xl hover:bg-gold-light transition-all text-sm uppercase tracking-wide"
          >
            Begin
          </button>
        </div>
      </div>
    );
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
        <button
          onClick={() => setScreen("welcome")}
          className="mt-8 text-parchment/20 text-xs hover:text-parchment transition-colors block mx-auto text-center"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}