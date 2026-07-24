import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import AuthModal from "./AuthModal";

const tabs = [
  { path: "/home", label: "Today", icon: "✦" },
  { path: "/codex", label: "Codex", icon: "📜" },
  { path: "/etu", label: "ETU", icon: "🎓" },
  { path: "/profile", label: "Profile", icon: "◎" },
];

// ── Sun icon (shown in dark mode — click to go light) ────────────────────────
function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="2" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

// ── Moon icon (shown in light mode — click to go dark) ───────────────────────
function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function TopNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showAuth, setShowAuth] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <header className="sticky top-0 z-40 bg-ink border-b border-parchment/10">

        {/* ── Row 1: brand · date · theme toggle · auth ── */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-parchment/10">
          {/* Brand */}
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity py-2.5 -my-2.5 min-h-11"
          >
            <span className="text-gold text-base">📜</span>
            <span className="text-parchment font-serif font-semibold text-sm hidden sm:block">
              Original Script
            </span>
          </button>

          {/* Date */}
          <span className="text-parchment/30 text-xs hidden sm:block">{today}</span>

          {/* Right side: theme toggle + auth */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="w-11 h-11 flex items-center justify-center rounded-full border border-parchment/15 text-parchment/50 hover:text-gold hover:border-gold/30 transition-all"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-xs text-gold font-bold shrink-0">
                  {user.email?.charAt(0).toUpperCase() ?? "?"}
                </div>
                <button
                  onClick={async () => {
                    await signOut();
                    navigate("/");
                  }}
                  className="text-parchment/30 text-xs hover:text-parchment transition-colors py-3.5 px-1"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="px-3 py-3.5 border border-parchment/20 text-parchment/60 text-xs rounded-lg hover:border-gold/40 hover:text-gold transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* ── Row 2: nav tabs ── */}
        <div className="flex">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 border-b-2 transition-all text-xs min-h-11 ${
                  isActive
                    ? "border-gold text-gold"
                    : "border-transparent text-parchment/40 hover:text-parchment/70"
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span className="uppercase tracking-wider text-[11px]">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={() => setShowAuth(false)}
        />
      )}
    </>
  );
}