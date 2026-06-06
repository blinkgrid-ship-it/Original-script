import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTodayEntries, chronicleDatabank } from "../component/data/chronicleData";
import ChronicleCard from "../component/chronicle/ChronicleCard";

export default function ChroniclePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"today" | "all" | "admin">("today");
  const [adminJson, setAdminJson] = useState("");
  const [adminSuccess, setAdminSuccess] = useState(false);

  const todayEntries = getTodayEntries();

  function handleAdminSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      JSON.parse(adminJson);
      setAdminSuccess(true);
      setAdminJson("");
      setTimeout(() => setAdminSuccess(false), 3000);
    } catch {
      alert("Invalid JSON — check your format and try again.");
    }
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
        <p className="text-gold font-serif font-bold">The Chronicle</p>
        <div className="w-16" />
      </div>

      {/* Tabs */}
      <div className="pt-20 px-4 max-w-3xl mx-auto">
        <div className="flex gap-2 mb-8 border-b border-parchment/10">
          {(["today", "all", "admin"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm capitalize transition-all border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-gold text-gold"
                  : "border-transparent text-parchment/40 hover:text-parchment"
              }`}
            >
              {tab === "today" ? "Today" : tab === "all" ? "All Entries" : "Admin Upload"}
            </button>
          ))}
        </div>

        {/* Today tab */}
        {activeTab === "today" && (
          <div>
            <div className="mb-8">
              <p className="text-xs text-parchment/30 uppercase tracking-widest mb-1">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <h1 className="text-3xl font-serif text-parchment">
                Today's Chronicle
              </h1>
            </div>
            {todayEntries.length === 0 ? (
              <p className="text-parchment/40 text-sm">No entries for today.</p>
            ) : (
              <div className="space-y-6 pb-16">
                {todayEntries.map((entry) => (
                  <ChronicleCard key={entry.id} entry={entry} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* All entries tab */}
        {activeTab === "all" && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-serif text-parchment">All Entries</h1>
              <p className="text-parchment/40 text-sm mt-1">
                {chronicleDatabank.length} entries in the databank
              </p>
            </div>
            <div className="space-y-6 pb-16">
              {chronicleDatabank.map((entry) => (
                <ChronicleCard key={entry.id} entry={entry} />
              ))}
            </div>
          </div>
        )}

        {/* Admin upload tab */}
        {activeTab === "admin" && (
          <div className="pb-16">
            <div className="mb-8">
              <h1 className="text-3xl font-serif text-parchment">Admin Upload</h1>
              <p className="text-parchment/40 text-sm mt-1">
                Paste a JSON entry to add to the Chronicle databank.
              </p>
            </div>

            {/* Format reference */}
            <div className="border border-parchment/10 rounded-xl p-5 mb-6 bg-slate/10">
              <p className="text-xs text-parchment/40 uppercase tracking-widest mb-3">
                Entry Format
              </p>
              <pre className="text-xs text-parchment/60 overflow-x-auto leading-relaxed">{`{
  "id": "unique-id",
  "type": "feature" | "insight" | "word",
  "tag": "Occasion" | "Archaeology" | "Hebrew Word" | "Theology",
  "date": "MM-DD",         // optional — for date-specific
  "title": "...",          // feature & insight
  "subtitle": "...",       // optional
  "description": "...",
  "sourceUrl": "...",      // optional
  "hebrew": "...",         // word type only
  "transliteration": "...",
  "meaning": "...",
  "reference": "Genesis 1:1"
}`}</pre>
            </div>

            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <textarea
                value={adminJson}
                onChange={(e) => setAdminJson(e.target.value)}
                placeholder='Paste JSON entry here...'
                rows={12}
                className="w-full px-4 py-3 bg-ink border border-parchment/20 rounded-lg text-parchment/80 placeholder-parchment/20 focus:outline-none focus:border-gold font-mono text-sm resize-none"
              />
              <button
                type="submit"
                className="w-full py-4 bg-gold text-ink font-semibold rounded hover:bg-gold-light transition-all text-sm uppercase tracking-wide"
              >
                Validate & Upload Entry
              </button>
              {adminSuccess && (
                <p className="text-center text-gold text-sm">
                  ✓ Entry validated successfully. (Connect to backend to persist.)
                </p>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}