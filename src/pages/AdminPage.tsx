import { useState } from "react";
import { useNavigate } from "react-router-dom";

type AdminTab = "chronicle" | "moderation" | "churches" | "conquest";

interface FlaggedItem {
  id: string;
  user: string;
  content: string;
  reason: string;
  timeAgo: string;
}

interface ChurchInstance {
  id: string;
  name: string;
  denomination: string;
  members: number;
  status: "active" | "pending";
  location: string;
}

const flaggedItems: FlaggedItem[] = [
  {
    id: "1",
    user: "anonymous_user_44",
    content: "This interpretation is completely wrong and anyone who believes it is...",
    reason: "Personal attack",
    timeAgo: "30m ago",
  },
  {
    id: "2",
    user: "john_d_92",
    content: "Buy my online Bible course at www...",
    reason: "Spam",
    timeAgo: "2h ago",
  },
  {
    id: "3",
    user: "theo_student_7",
    content: "The Documentary Hypothesis is satanic garbage and anyone who teaches it...",
    reason: "Abusive language",
    timeAgo: "5h ago",
  },
];

const churchInstances: ChurchInstance[] = [
  {
    id: "1",
    name: "CSI London",
    denomination: "Church of South India",
    members: 142,
    status: "active",
    location: "London, UK",
  },
  {
    id: "2",
    name: "St. Thomas Dubai",
    denomination: "Jacobite Syrian",
    members: 89,
    status: "active",
    location: "Dubai, UAE",
  },
  {
    id: "3",
    name: "Kottayam Pentecostal Assembly",
    denomination: "Pentecostal",
    members: 0,
    status: "pending",
    location: "Kottayam, Kerala",
  },
];

export default function AdminPage() {
  const navigate = useNavigate();
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("chronicle");
  const [flags, setFlags] = useState(flaggedItems);
  const [churches, setChurches] = useState(churchInstances);
  const [jsonInput, setJsonInput] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [churchName, setChurchName] = useState("");
  const [churchDenom, setChurchDenom] = useState("");
  const [churchLocation, setChurchLocation] = useState("");
  const [churchCreated, setChurchCreated] = useState(false);
  const [conquestWord, setConquestWord] = useState("");
  const [conquestChapter, setConquestChapter] = useState("1");
  const [conquestSuccess, setConquestSuccess] = useState(false);

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-6">
        <div className="max-w-sm w-full text-center">
          <p className="text-gold font-serif text-2xl mb-2">Admin Portal</p>
          <p className="text-parchment/40 text-sm mb-8">Internal use only</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (pin === "blinkgrid") setUnlocked(true);
              else alert("Incorrect PIN");
            }}
            className="space-y-4"
          >
            <input
              type="password"
              placeholder="Enter admin PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-4 py-3 bg-ink border border-parchment/20 rounded text-parchment placeholder-parchment/30 focus:outline-none focus:border-gold text-center text-sm"
            />
            <button
              type="submit"
              className="w-full py-3 bg-gold text-ink font-semibold rounded hover:bg-gold-light transition-all text-sm uppercase tracking-wide"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  function handleChronicleUpload(e: React.FormEvent) {
    e.preventDefault();
    try {
      JSON.parse(jsonInput);
      setUploadSuccess(true);
      setJsonInput("");
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch {
      alert("Invalid JSON — check format and try again.");
    }
  }

  function dismissFlag(id: string) {
    setFlags((f) => f.filter((item) => item.id !== id));
  }

  function approveChurch(id: string) {
    setChurches((c) =>
      c.map((ch) => (ch.id === id ? { ...ch, status: "active" } : ch))
    );
  }

  function handleCreateChurch(e: React.FormEvent) {
    e.preventDefault();
    const newChurch: ChurchInstance = {
      id: String(Date.now()),
      name: churchName,
      denomination: churchDenom,
      members: 0,
      status: "pending",
      location: churchLocation,
    };
    setChurches((c) => [...c, newChurch]);
    setChurchCreated(true);
    setChurchName("");
    setChurchDenom("");
    setChurchLocation("");
    setTimeout(() => setChurchCreated(false), 3000);
  }

  return (
    <div className="min-h-screen bg-ink">
      <div className="fixed top-0 left-0 right-0 z-40 bg-ink/90 backdrop-blur border-b border-gold/10 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="text-parchment/50 hover:text-parchment text-sm transition-colors"
        >
          ← Back
        </button>
        <div className="text-center">
          <p className="text-gold font-serif font-bold">Admin Portal</p>
          <p className="text-parchment/30 text-xs">Internal use only</p>
        </div>
        <button
          onClick={() => setUnlocked(false)}
          className="text-parchment/20 hover:text-parchment/50 text-xs transition-colors"
        >
          Lock
        </button>
      </div>

      <div className="pt-20 px-4 max-w-3xl mx-auto">
        <div className="flex gap-2 mb-8 border-b border-parchment/10 overflow-x-auto">
          {(["chronicle", "moderation", "churches", "conquest"] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm whitespace-nowrap transition-all border-b-2 -mb-px capitalize ${
                  activeTab === tab
                    ? "border-gold text-gold"
                    : "border-transparent text-parchment/40 hover:text-parchment"
                }`}
              >
                {tab === "chronicle"
                  ? "Chronicle"
                  : tab === "moderation"
                  ? "Moderation"
                  : tab === "churches"
                  ? "Churches"
                  : "Conquest Content"}
              </button>
            )
          )}
        </div>

        {activeTab === "chronicle" && (
          <div className="pb-16">
            <h2 className="text-2xl font-serif text-parchment mb-2">
              Chronicle Databank
            </h2>
            <p className="text-parchment/40 text-sm mb-8">
              Upload new entries to the Chronicle feed. Paste a valid JSON entry below.
            </p>
            <div className="border border-parchment/10 rounded-xl p-5 mb-6 bg-slate/10">
              <p className="text-xs text-parchment/40 uppercase tracking-widest mb-3">
                Entry Format
              </p>
              <pre className="text-xs text-parchment/60 overflow-x-auto leading-relaxed">{`{
  "id": "unique-id",
  "type": "feature" | "insight" | "word",
  "tag": "Occasion" | "Archaeology" | "Hebrew Word" | "Theology",
  "date": "MM-DD",
  "title": "...",
  "description": "...",
  "sourceUrl": "...",
  "hebrew": "...",
  "transliteration": "...",
  "meaning": "...",
  "reference": "Genesis 1:1"
}`}</pre>
            </div>
            <form onSubmit={handleChronicleUpload} className="space-y-4">
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste JSON entry here..."
                rows={12}
                className="w-full px-4 py-3 bg-ink border border-parchment/20 rounded-lg text-parchment/80 placeholder-parchment/20 focus:outline-none focus:border-gold font-mono text-sm resize-none"
              />
              <button
                type="submit"
                className="w-full py-4 bg-gold text-ink font-semibold rounded hover:bg-gold-light transition-all text-sm uppercase tracking-wide"
              >
                Validate & Upload
              </button>
              {uploadSuccess && (
                <p className="text-center text-gold text-sm">
                  ✓ Entry validated and uploaded.
                </p>
              )}
            </form>
          </div>
        )}

        {activeTab === "moderation" && (
          <div className="pb-16">
            <h2 className="text-2xl font-serif text-parchment mb-2">
              Moderation Queue
            </h2>
            <p className="text-parchment/40 text-sm mb-8">
              {flags.length} item{flags.length !== 1 ? "s" : ""} flagged for review.
            </p>
            {flags.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">✓</p>
                <p className="text-parchment/40">Queue is clear.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {flags.map((item) => (
                  <div
                    key={item.id}
                    className="border border-parchment/10 rounded-xl p-6"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <span className="text-xs text-ember/70 uppercase tracking-widest border border-ember/20 px-2 py-1 rounded">
                        {item.reason}
                      </span>
                      <span className="text-parchment/30 text-xs shrink-0">
                        {item.timeAgo}
                      </span>
                    </div>
                    <p className="text-parchment/40 text-xs mb-1">{item.user}</p>
                    <p className="text-parchment/70 text-sm italic mb-5">
                      "{item.content}"
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => dismissFlag(item.id)}
                        className="px-4 py-2 text-xs border border-parchment/10 text-parchment/40 rounded hover:border-parchment/30 hover:text-parchment transition-all"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => dismissFlag(item.id)}
                        className="px-4 py-2 text-xs border border-ember/30 text-ember/70 rounded hover:bg-ember/10 transition-all"
                      >
                        Warn User
                      </button>
                      <button
                        onClick={() => dismissFlag(item.id)}
                        className="px-4 py-2 text-xs bg-ember/20 text-ember rounded hover:bg-ember/30 transition-all"
                      >
                        Ban User
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "churches" && (
          <div className="pb-16">
            <h2 className="text-2xl font-serif text-parchment mb-2">
              Church Instances
            </h2>
            <p className="text-parchment/40 text-sm mb-8">
              Manage white-label church instances on the platform.
            </p>
            <div className="space-y-4 mb-10">
              {churches.map((church) => (
                <div
                  key={church.id}
                  className="border border-parchment/10 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h3 className="text-parchment font-serif text-lg">
                      {church.name}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded border shrink-0 ${
                        church.status === "active"
                          ? "border-gold/20 text-gold/60"
                          : "border-parchment/10 text-parchment/30"
                      }`}
                    >
                      {church.status}
                    </span>
                  </div>
                  <p className="text-parchment/40 text-sm">
                    {church.denomination} · {church.location}
                  </p>
                  <p className="text-parchment/30 text-xs mt-1 mb-4">
                    {church.members} members
                  </p>
                  {church.status === "pending" && (
                    <button
                      onClick={() => approveChurch(church.id)}
                      className="px-4 py-2 text-xs border border-gold text-gold rounded hover:bg-gold hover:text-ink transition-all"
                    >
                      Approve Instance
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="border border-parchment/10 rounded-xl p-6">
              <h3 className="text-parchment font-serif text-xl mb-5">
                Create New Church Instance
              </h3>
              {churchCreated ? (
                <p className="text-center text-gold py-4">
                  ✓ Church instance created and set to pending approval.
                </p>
              ) : (
                <form onSubmit={handleCreateChurch} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Church name"
                    value={churchName}
                    onChange={(e) => setChurchName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-ink border border-parchment/20 rounded text-parchment placeholder-parchment/30 focus:outline-none focus:border-gold text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Denomination"
                    value={churchDenom}
                    onChange={(e) => setChurchDenom(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-ink border border-parchment/20 rounded text-parchment placeholder-parchment/30 focus:outline-none focus:border-gold text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Location (e.g. London, UK)"
                    value={churchLocation}
                    onChange={(e) => setChurchLocation(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-ink border border-parchment/20 rounded text-parchment placeholder-parchment/30 focus:outline-none focus:border-gold text-sm"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-gold text-ink font-semibold rounded hover:bg-gold-light transition-all text-sm uppercase tracking-wide"
                  >
                    Create Instance
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {activeTab === "conquest" && (
          <div className="pb-16">
            <h2 className="text-2xl font-serif text-parchment mb-2">
              Conquest Content
            </h2>
            <p className="text-parchment/40 text-sm mb-8">
              Upload new Hebrew word entries for Genesis chapters.
            </p>
            {conquestSuccess ? (
              <div className="text-center py-8">
                <p className="text-3xl mb-3">✓</p>
                <p className="text-gold font-serif">Word entry uploaded.</p>
                <button
                  onClick={() => setConquestSuccess(false)}
                  className="mt-4 text-xs text-parchment/30 hover:text-parchment transition-colors"
                >
                  Add another
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setConquestSuccess(true);
                  setConquestWord("");
                }}
                className="space-y-4"
              >
                <div className="flex gap-3 items-center">
                  <label className="text-parchment/40 text-sm shrink-0">
                    Chapter:
                  </label>
                  <select
                    value={conquestChapter}
                    onChange={(e) => setConquestChapter(e.target.value)}
                    className="px-4 py-3 bg-ink border border-parchment/20 rounded text-parchment focus:outline-none focus:border-gold text-sm"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={String(n)}>
                        Genesis {n}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  value={conquestWord}
                  onChange={(e) => setConquestWord(e.target.value)}
                  placeholder={`Paste Hebrew word JSON entry...\n\n{\n  "id": "shalom",\n  "hebrew": "שָׁלוֹם",\n  "transliteration": "Shalom",\n  "root": "שלם",\n  "primaryMeaning": "Peace",\n  ...\n}`}
                  rows={14}
                  required
                  className="w-full px-4 py-3 bg-ink border border-parchment/20 rounded-lg text-parchment/80 placeholder-parchment/20 focus:outline-none focus:border-gold font-mono text-sm resize-none"
                />
                <button
                  type="submit"
                  className="w-full py-4 bg-gold text-ink font-semibold rounded hover:bg-gold-light transition-all text-sm uppercase tracking-wide"
                >
                  Upload Word Entry
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}