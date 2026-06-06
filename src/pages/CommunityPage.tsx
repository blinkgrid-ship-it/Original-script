import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  forumThreads,
  prayerGroups,
  audioRooms,
} from "../data/communityData";

type Tab = "forums" | "prayer" | "rooms" | "onboarding";

export default function CommunityPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("forums");
  const [pathway, setPathway] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [newGroupPrivacy, setNewGroupPrivacy] = useState<"open" | "invite-only">("open");
  const [groupCreated, setGroupCreated] = useState(false);

  const pathways = [
    {
      name: "Wisdom Seeker",
      icon: "🕊️",
      description: "Gentle, faith-affirming exploration of scripture in context.",
    },
    {
      name: "Serious Learner",
      icon: "📜",
      description: "Hebrew words, historical layers, academic commentary.",
    },
    {
      name: "Theology Student",
      icon: "⚖️",
      description: "Rigorous scholarship, structured debate, denomination comparison.",
    },
  ];

  if (showOnboarding && !pathway) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-6">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-10">
            <p className="text-gold/60 text-xs uppercase tracking-widest mb-2">
              Welcome to the Community
            </p>
            <h1 className="text-3xl font-serif text-parchment mb-3">
              Choose Your Pathway
            </h1>
            <p className="text-parchment/50 text-sm">
              This shapes your feed, your community group, and your Conquest difficulty.
              You can change it later.
            </p>
          </div>
          <div className="space-y-4">
            {pathways.map((p) => (
              <button
                key={p.name}
                onClick={() => {
                  setPathway(p.name);
                  setShowOnboarding(false);
                }}
                className="w-full flex items-center gap-5 p-6 border border-parchment/10 rounded-xl hover:border-gold/40 hover:bg-slate/10 transition-all text-left group"
              >
                <span className="text-4xl">{p.icon}</span>
                <div>
                  <p className="text-parchment font-serif text-lg group-hover:text-gold transition-colors">
                    {p.name}
                  </p>
                  <p className="text-parchment/50 text-sm mt-1">{p.description}</p>
                </div>
                <span className="ml-auto text-parchment/20 group-hover:text-gold transition-colors text-xl">
                  →
                </span>
              </button>
            ))}
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
        <p className="text-gold font-serif font-bold">Community</p>
        <div className="flex items-center gap-2">
          <span className="text-parchment/30 text-xs">{pathway}</span>
          <button
            onClick={() => { setPathway(null); setShowOnboarding(true); }}
            className="text-parchment/20 hover:text-parchment/50 text-xs transition-colors"
          >
            change
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="pt-20 px-4 max-w-3xl mx-auto">
        <div className="flex gap-2 mb-8 border-b border-parchment/10 overflow-x-auto">
          {(["forums", "prayer", "rooms"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm capitalize whitespace-nowrap transition-all border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-gold text-gold"
                  : "border-transparent text-parchment/40 hover:text-parchment"
              }`}
            >
              {tab === "forums"
                ? "Discussion Forums"
                : tab === "prayer"
                ? "Prayer Groups"
                : "Audio Rooms"}
            </button>
          ))}
        </div>

        {/* Forums tab */}
        {activeTab === "forums" && (
          <div className="space-y-4 pb-16">
            {forumThreads.map((thread) => (
              <div
                key={thread.id}
                className="border border-parchment/10 rounded-xl p-6 hover:border-gold/20 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <span className="text-xs text-gold/60 uppercase tracking-widest border border-gold/20 px-2 py-1 rounded shrink-0">
                    {thread.category}
                  </span>
                  <span className="text-parchment/30 text-xs shrink-0">{thread.timeAgo}</span>
                </div>
                <h3 className="text-parchment font-serif text-lg mb-2 group-hover:text-gold transition-colors">
                  {thread.title}
                </h3>
                <p className="text-parchment/50 text-sm leading-relaxed mb-4">
                  {thread.preview}
                </p>
                <div className="flex items-center justify-between text-xs text-parchment/30">
                  <span>
                    {thread.author} · {thread.location}
                  </span>
                  <span>{thread.replies} replies</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Prayer groups tab */}
        {activeTab === "prayer" && (
          <div className="pb-16">
            <div className="space-y-4 mb-10">
              {prayerGroups.map((group) => (
                <div
                  key={group.id}
                  className="border border-parchment/10 rounded-xl p-6 hover:border-gold/20 transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-parchment font-serif text-lg">{group.name}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded border shrink-0 ${
                        group.privacy === "open"
                          ? "border-gold/20 text-gold/60"
                          : "border-parchment/10 text-parchment/30"
                      }`}
                    >
                      {group.privacy}
                    </span>
                  </div>
                  <p className="text-parchment/50 text-sm mb-3">{group.description}</p>
                  {group.scheduledTime && (
                    <p className="text-parchment/30 text-xs mb-4">
                      🕐 {group.scheduledTime}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-parchment/30 text-xs">
                      {group.members}/{group.maxMembers} members
                    </span>
                    <button className="px-4 py-2 text-xs border border-gold text-gold rounded hover:bg-gold hover:text-ink transition-all">
                      {group.privacy === "open" ? "Join Group" : "Request to Join"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Create group form */}
            <div className="border border-parchment/10 rounded-xl p-6">
              <h3 className="text-parchment font-serif text-xl mb-5">
                Create a Prayer Group
              </h3>
              {groupCreated ? (
                <div className="text-center py-4">
                  <p className="text-3xl mb-3">🙏</p>
                  <p className="text-gold font-serif">Group created successfully.</p>
                  <p className="text-parchment/40 text-sm mt-1">
                    Share the join link with your community.
                  </p>
                  <button
                    onClick={() => setGroupCreated(false)}
                    className="mt-4 text-xs text-parchment/30 hover:text-parchment transition-colors"
                  >
                    Create another
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setGroupCreated(true);
                    setNewGroupName("");
                    setNewGroupDesc("");
                  }}
                  className="space-y-4"
                >
                  <input
                    type="text"
                    placeholder="Group name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-ink border border-parchment/20 rounded text-parchment placeholder-parchment/30 focus:outline-none focus:border-gold text-sm"
                  />
                  <textarea
                    placeholder="Description"
                    value={newGroupDesc}
                    onChange={(e) => setNewGroupDesc(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-ink border border-parchment/20 rounded text-parchment placeholder-parchment/30 focus:outline-none focus:border-gold text-sm resize-none"
                  />
                  <div className="flex gap-3">
                    {(["open", "invite-only"] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setNewGroupPrivacy(opt)}
                        className={`px-4 py-2 text-xs rounded border transition-all capitalize ${
                          newGroupPrivacy === opt
                            ? "border-gold bg-gold/10 text-gold"
                            : "border-parchment/10 text-parchment/40"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-gold text-ink font-semibold rounded hover:bg-gold-light transition-all text-sm uppercase tracking-wide"
                  >
                    Create Group
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Audio rooms tab */}
        {activeTab === "rooms" && (
          <div className="pb-16">
            <div className="space-y-4 mb-8">
              {audioRooms.map((room) => (
                <div
                  key={room.id}
                  className="border border-parchment/10 rounded-xl p-6 hover:border-gold/20 transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      {room.live && (
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      )}
                      <span className="text-xs text-parchment/30">
                        {room.live ? "LIVE" : "Scheduled"}
                      </span>
                    </div>
                    <span className="text-xs text-parchment/30 border border-parchment/10 px-2 py-1 rounded">
                      {room.topic}
                    </span>
                  </div>
                  <h3 className="text-parchment font-serif text-lg mb-1">
                    {room.title}
                  </h3>
                  <p className="text-parchment/40 text-sm mb-4">
                    Hosted by {room.host}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-parchment/30 text-xs">
                      {room.live ? `${room.listeners} listening` : "Not started"}
                    </span>
                    <button
                      className={`px-4 py-2 text-xs rounded border transition-all ${
                        room.live
                          ? "border-gold text-gold hover:bg-gold hover:text-ink"
                          : "border-parchment/10 text-parchment/30 cursor-not-allowed"
                      }`}
                      disabled={!room.live}
                    >
                      {room.live ? "Join Room" : "Remind Me"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Open a room */}
            <div className="border border-parchment/10 rounded-xl p-6 text-center">
              <p className="text-4xl mb-3">🎙️</p>
              <h3 className="text-parchment font-serif text-xl mb-2">
                Open an Audio Room
              </h3>
              <p className="text-parchment/40 text-sm mb-5">
                Start a live discussion. Anyone in the community can join and listen.
                Audio powered by WebRTC — coming soon.
              </p>
              <button className="px-6 py-3 border border-gold/30 text-gold/50 rounded text-sm cursor-not-allowed">
                Open a Room (Coming Soon)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}