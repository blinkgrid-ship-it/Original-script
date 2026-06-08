import { useNavigate, useLocation } from "react-router-dom";

const tabs = [
  { path: "/question", label: "Today", icon: "✦" },
  { path: "/codex", label: "Codex", icon: "📜" },
  { path: "/conquest", label: "Conquest", icon: "⚔️" },
  { path: "/profile", label: "Profile", icon: "◎" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-ink border-t border-parchment/10 flex">
      {tabs.map((tab) => {
        const active = pathname === tab.path;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex-1 flex flex-col items-center py-3 gap-1 transition-all ${
              active ? "text-gold" : "text-parchment/30 hover:text-parchment/60"
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="text-[10px] uppercase tracking-wider">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}