import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAdminStats, exportAdminVerses, type AdminStats } from "../../lib/api";
import { A, HEAD, card, btn } from "./adminTheme";

// Dashboard: live coverage stats from /api/admin/stats. "Notes" and "Last upload" are
// display-only placeholders — those features aren't tracked yet.
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchAdminStats().then(setStats).catch((e) => setError(e.message));
  }, []);

  async function onExport() {
    setExporting(true);
    try {
      const blob = await exportAdminVerses();
      downloadBlob(blob, "verses.csv");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setExporting(false);
    }
  }

  const ml = stats?.translations.find((t) => t.language === "ml")?.verses ?? 0;

  return (
    <div style={{ maxWidth: 1060 }}>
      <h1 style={{ fontFamily: HEAD, fontSize: "2.1rem", fontWeight: 600, marginBottom: 4 }}>Dashboard</h1>
      <p style={{ color: A.inkSoft, marginBottom: "1.8rem" }}>Welcome back — here is your content overview.</p>

      {error && <p style={{ color: A.danger, marginBottom: "1rem" }}>{error}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: "2rem" }}>
        <Stat label="Total verses" value={stats ? String(stats.verses.total) : "…"} />
        <Stat label="Books with content" value={stats ? String(stats.verses.byBook.length) : "…"} />
        <Stat label="Verses with Hebrew" value={stats ? String(stats.verses.withHebrew) : "…"} />
        <Stat label="Malayalam translations" value={stats ? String(ml) : "…"} />
      </div>

      <h2 style={{ fontFamily: HEAD, fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.8rem" }}>Quick actions</h2>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: "2.4rem" }}>
        <button style={btn("primary")} onClick={() => navigate("/admin/upload")}>⇪ Upload new content</button>
        <button style={btn("ghost")} onClick={onExport} disabled={exporting}>
          {exporting ? "Preparing…" : "Export all verses as CSV"}
        </button>
      </div>

      {stats && stats.verses.byBook.length > 0 && (
        <>
          <h2 style={{ fontFamily: HEAD, fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.8rem" }}>Coverage by book</h2>
          <div style={{ ...card, padding: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: A.panel, textAlign: "left" }}>
                  <th style={th}>Book</th>
                  <th style={th}>Verses</th>
                  <th style={th}>Languages</th>
                </tr>
              </thead>
              <tbody>
                {stats.verses.byBook.map((b) => (
                  <tr key={b.book} style={{ borderTop: `1px solid ${A.panelEdge}` }}>
                    <td style={td}>{b.book}</td>
                    <td style={td}>{b.verses}</td>
                    <td style={td}>
                      English{stats.verses.withHebrew > 0 ? " · Hebrew (partial)" : ""}{ml > 0 ? " · Malayalam (partial)" : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={card}>
      <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: A.inkFaint, marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: HEAD, fontSize: "2rem", fontWeight: 600, color: A.emeraldD }}>{value}</div>
    </div>
  );
}

const th: React.CSSProperties = { padding: "10px 16px", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: A.inkFaint, fontWeight: 600 };
const td: React.CSSProperties = { padding: "11px 16px", color: A.ink };

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
