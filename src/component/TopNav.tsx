import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

const tabs = [
  { path: "/home", label: "Today", icon: "✦" },
  { path: "/codex", label: "Codex", icon: "📜" },
//   { path: "/conquest", label: "Conquest", icon: "⚔️" },
  { path: "/profile", label: "Profile", icon: "◎" },
];

export default function TopNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <div className="sticky top-0 z-40 bg-ink border-b border-parchment/10">
        {/* Row 1: Brand + auth */}
        <div className="px-5 py-3 flex items-center justify-between">
          <div>
            <p className="text-gold font-serif font-bold text-base">Original Script</p>
            <p className="text-parchment/30 text-xs">{today}</p>
          </div>
          {user ? (
            <button
              onClick={() => navigate("/profile")}
              className="w-8 h-8 rounded-full bg-slate/50 flex items-center justify-center text-xs font-bold text-gold border border-gold/20"
            >
              {user.email?.charAt(0).toUpperCase()}
            </button>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="px-4 py-1.5 border border-gold/40 text-gold text-xs uppercase tracking-wider rounded-lg hover:bg-gold/10 transition-all"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Row 2: Nav tabs */}
        <div className="flex border-t border-parchment/5">
          {tabs.map((tab) => {
            const active = pathname === tab.path ||
              (tab.path === "/conquest" && pathname === "/conquest");
            return (
              <button
                key={tab.path}
                onClick={() =>
                  navigate(tab.path === "/conquest" ? "/conquest?chapter=1" : tab.path)
                }
                className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-all border-b-2 ${
                  active
                    ? "border-gold text-gold"
                    : "border-transparent text-parchment/30 hover:text-parchment/60"
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span className="text-[9px] uppercase tracking-wider">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={() => setShowAuth(false)}
        />
      )}
    </>
  );
}