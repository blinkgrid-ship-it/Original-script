import { A, HEAD, card, label, input, btn } from "./adminTheme";

// User Roles — DISPLAY-ONLY for now. The real system is a single is_admin flag granted
// manually; this page previews the planned invite + role-matrix design without being
// wired to anything (buttons disabled on purpose).
const ROLES = ["Superadmin", "Editor", "Viewer"] as const;
const MATRIX: { feature: string; allowed: boolean[] }[] = [
  { feature: "View dashboard", allowed: [true, true, true] },
  { feature: "Upload content", allowed: [true, true, false] },
  { feature: "Edit verses", allowed: [true, true, false] },
  { feature: "Delete verses", allowed: [true, false, false] },
  { feature: "Manage user roles", allowed: [true, false, false] },
];

export default function AdminRoles() {
  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ fontFamily: HEAD, fontSize: "2.1rem", fontWeight: 600, marginBottom: 4 }}>User roles</h1>
      <p style={{ color: A.inkSoft, marginBottom: "1rem" }}>Manage who has access to the admin portal.</p>

      <div style={{ ...card, borderColor: A.gold, marginBottom: "1.4rem", fontSize: 13, color: A.inkSoft, lineHeight: 1.6 }}>
        <strong style={{ color: A.emeraldD }}>Preview only.</strong> Role management isn't wired up yet — admin access is currently
        granted by the engineering team directly. This page shows the planned design for when
        the full role system lands.
      </div>

      {/* Current users */}
      <div style={{ ...card, padding: 0, overflow: "hidden", marginBottom: "1.4rem" }}>
        <div style={{ padding: "13px 16px", fontFamily: HEAD, fontSize: 15, fontWeight: 600, borderBottom: `1px solid ${A.panelEdge}` }}>Current users</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
          <thead>
            <tr style={{ background: A.panel, textAlign: "left" }}>
              <th style={th}>Email</th><th style={th}>Role</th><th style={th}>Status</th><th style={{ ...th, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderTop: `1px solid ${A.panelEdge}` }}>
              <td style={td}>shalomsam1717@gmail.com</td>
              <td style={td}><Badge color={A.emerald}>Superadmin</Badge></td>
              <td style={td}><Badge color={A.gold}>Active</Badge></td>
              <td style={{ ...td, textAlign: "right" }}><button style={{ ...btn("ghost"), padding: "5px 12px", fontSize: 12, opacity: 0.45, cursor: "not-allowed" }} disabled>Remove</button></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Invite (disabled) */}
      <div style={{ ...card, marginBottom: "1.4rem" }}>
        <div style={{ fontFamily: HEAD, fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Invite a team member</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <span style={label}>Email</span>
            <input style={{ ...input, opacity: 0.6 }} placeholder="colleague@domain.com" disabled />
          </div>
          <div style={{ minWidth: 140 }}>
            <span style={label}>Role</span>
            <select style={{ ...input, opacity: 0.6 }} disabled><option>Editor</option></select>
          </div>
          <button style={{ ...btn("primary"), opacity: 0.45, cursor: "not-allowed" }} disabled>Send invite</button>
        </div>
      </div>

      {/* Permission matrix */}
      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "13px 16px", fontFamily: HEAD, fontSize: 15, fontWeight: 600, borderBottom: `1px solid ${A.panelEdge}` }}>Role permissions</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
          <thead>
            <tr style={{ background: A.panel, textAlign: "left" }}>
              <th style={th}>Feature</th>
              {ROLES.map((r) => <th key={r} style={{ ...th, textAlign: "center" }}>{r}</th>)}
            </tr>
          </thead>
          <tbody>
            {MATRIX.map((row) => (
              <tr key={row.feature} style={{ borderTop: `1px solid ${A.panelEdge}` }}>
                <td style={td}>{row.feature}</td>
                {row.allowed.map((ok, i) => (
                  <td key={i} style={{ ...td, textAlign: "center", color: ok ? A.emerald : A.inkFaint, fontWeight: ok ? 700 : 400 }}>{ok ? "✓" : "✕"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return <span style={{ background: `${color}22`, color, borderRadius: 999, padding: "3px 11px", fontSize: 11.5, fontWeight: 600 }}>{children}</span>;
}

const th: React.CSSProperties = { padding: "10px 16px", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: A.inkFaint, fontWeight: 600 };
const td: React.CSSProperties = { padding: "11px 16px", color: A.inkSoft };
