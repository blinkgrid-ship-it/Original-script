import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { fetchAdminMe } from "../../lib/api";
import { A, HEAD, SERIF } from "./adminTheme";

// ─────────────────────────────────────────────────────────────────────────────
// Admin portal shell: deep-emerald sidebar + parchment content, same family as the
// ETU reader. Gates on GET /api/admin/me — non-admins (or signed-out users) are
// bounced to /home. The backend re-checks is_admin on every API call regardless;
// this gate is purely so non-admins never see the UI.
// ─────────────────────────────────────────────────────────────────────────────

const NAV = [
  { to: "/admin", label: "Dashboard", icon: "▦", end: true },
  { to: "/admin/upload", label: "Upload Content", icon: "⇪" },
  { to: "/admin/verses", label: "Manage Verses", icon: "❧" },
  { to: "/admin/roles", label: "User Roles", icon: "◫" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [state, setState] = useState<"checking" | "ok">("checking");
  const [email, setEmail] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchAdminMe()
      .then((me) => {
        if (cancelled) return;
        setEmail(me.email);
        setState("ok");
      })
      .catch(() => {
        if (!cancelled) navigate("/home", { replace: true });
      });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (state === "checking") {
    return (
      <div style={{ minHeight: "100vh", background: A.paper, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HEAD, color: A.inkFaint, fontStyle: "italic", fontSize: 18 }}>
        Verifying access…
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: A.paper, fontFamily: SERIF, color: A.ink }}>
      {/* ── Mobile top bar (hidden on desktop via .admin-mobilebar) ── */}
      <div
        className="admin-mobilebar"
        style={{ display: "none", position: "sticky", top: 0, zIndex: 25, alignItems: "center", gap: "0.7rem", padding: "0.8rem 1rem", background: A.emeraldD, color: A.cream }}
      >
        <button
          onClick={() => setSidebarOpen((s) => !s)}
          aria-label="Toggle menu"
          style={{ width: 44, height: 44, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(246,241,231,0.12)", border: "1px solid rgba(246,241,231,0.2)", borderRadius: 9, color: A.cream, fontSize: 18, cursor: "pointer" }}
        >
          ☰
        </button>
        <div style={{ fontFamily: HEAD, fontSize: 16, fontWeight: 600 }}>ETU Admin</div>
      </div>

      {/* ── Sidebar backdrop (mobile only, when open) ── */}
      {sidebarOpen && (
        <div
          className="admin-backdrop"
          onClick={() => setSidebarOpen(false)}
          style={{ display: "none", position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 29 }}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className="admin-sidebar"
        data-open={sidebarOpen ? "" : undefined}
        style={{ width: 250, flexShrink: 0, background: A.emeraldD, color: A.cream, display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" }}
      >
        <div style={{ padding: "1.4rem 1.25rem 1.1rem", display: "flex", alignItems: "center", gap: "0.7rem", borderBottom: "1px solid rgba(246,241,231,0.12)" }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: A.gold, color: A.emeraldD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>✦</div>
          <div style={{ lineHeight: 1.15 }}>
            <div style={{ fontFamily: HEAD, fontSize: 17, fontWeight: 600 }}>ETU Admin</div>
            <div style={{ fontSize: 9.5, letterSpacing: "0.16em", color: A.goldSoft, textTransform: "uppercase" }}>Content Portal</div>
          </div>
        </div>

        <nav style={{ padding: "0.9rem 0.7rem", display: "flex", flexDirection: "column", gap: 3 }}>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 11,
                padding: "13px 13px",
                borderRadius: 9,
                fontSize: 14,
                textDecoration: "none",
                color: isActive ? A.cream : "rgba(246,241,231,0.62)",
                background: isActive ? "rgba(176,137,72,0.28)" : "transparent",
                borderLeft: isActive ? `3px solid ${A.gold}` : "3px solid transparent",
                fontWeight: isActive ? 600 : 400,
              })}
            >
              <span style={{ width: 18, textAlign: "center", opacity: 0.9 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: "auto", padding: "1rem 1.25rem 1.2rem", borderTop: "1px solid rgba(246,241,231,0.12)", fontSize: 13 }}>
          {email && <div style={{ fontSize: 11, color: "rgba(246,241,231,0.45)", marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email}</div>}
          <button onClick={() => navigate("/etu/genesis/1")} style={sideLink}>⤴ View Bible Reader</button>
          <button onClick={() => navigate("/home")} style={sideLink}>← Back to Original Script</button>
        </div>
      </aside>

      {/* ── Content ── */}
      <main style={{ flex: 1, minWidth: 0, padding: "2.2rem clamp(1.5rem, 4vw, 3.2rem) 4rem" }}>
        <Outlet />
      </main>

      {/* Responsive: collapse the always-on sidebar into a hamburger-triggered
          drawer below 860px, since a fixed 250px sidebar leaves almost no room
          for content on phone widths. */}
      <style>{`
        @media (max-width: 860px) {
          .admin-mobilebar { display: flex !important; }
          .admin-backdrop { display: block !important; }
          .admin-sidebar {
            display: none !important;
            position: fixed !important;
            inset: 0 auto 0 0;
            width: min(280px, 82vw) !important;
            height: 100vh !important;
            z-index: 30;
            box-shadow: 0 0 40px rgba(0,0,0,0.35);
          }
          .admin-sidebar[data-open] { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

const sideLink: React.CSSProperties = {
  display: "block",
  width: "100%",
  textAlign: "left",
  background: "none",
  border: "none",
  color: "rgba(246,241,231,0.7)",
  fontSize: 13,
  fontFamily: SERIF,
  cursor: "pointer",
  padding: "10px 0",
};
