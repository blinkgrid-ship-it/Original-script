import { useCallback, useEffect, useState } from "react";
import {
  fetchAdminVerses, createAdminVerse, updateAdminVerse, deleteAdminVerse, exportAdminVerses,
  type AdminVerse,
} from "../../lib/api";
import { A, HEAD, SERIF, BOOKS, card, label, input, btn } from "./adminTheme";
import { downloadBlob } from "./AdminDashboard";

// Manage Verses: server-paginated browse with book/chapter/text filters, inline add form,
// modal editor (English + Hebrew + Malayalam in one place), delete with confirm, CSV export.
export default function AdminVerses() {
  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<{ verses: AdminVerse[]; total: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminVerse | null>(null);
  const [adding, setAdding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<AdminVerse | null>(null);

  const PAGE_SIZE = 25;

  const load = useCallback(async (p = page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAdminVerses({ book: book || undefined, chapter: chapter || undefined, search: search || undefined, page: p, pageSize: PAGE_SIZE });
      setData({ verses: res.verses, total: res.total });
      setPage(res.page);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [book, chapter, search, page]);

  useEffect(() => { load(1); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  async function onDelete(v: AdminVerse) {
    try {
      await deleteAdminVerse(v.id);
      setConfirmDelete(null);
      load(page);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function onExport() {
    try {
      downloadBlob(await exportAdminVerses(book || undefined), book ? `verses-${book}.csv` : "verses.csv");
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: HEAD, fontSize: "2.1rem", fontWeight: 600, marginBottom: 4 }}>Manage verses</h1>
          <p style={{ color: A.inkSoft, marginBottom: "1.4rem" }}>Browse, edit, add, and remove verses stored in the reader.</p>
        </div>
        <button style={btn("ghost")} onClick={onExport}>⇓ Export {book || "all"} as CSV</button>
      </div>

      {/* Add-a-verse */}
      <button
        onClick={() => setAdding((a) => !a)}
        style={{ ...card, width: "100%", textAlign: "left", cursor: "pointer", marginBottom: 14, fontFamily: HEAD, fontSize: 15, color: A.emeraldD, fontWeight: 600 }}
      >
        {adding ? "− Close manual entry" : "+ Add a verse manually"}
      </button>
      {adding && <AddVerseForm onDone={() => { setAdding(false); load(page); }} onError={setError} />}

      {/* Filters */}
      <div style={{ ...card, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 14 }}>
        <div style={{ minWidth: 180 }}>
          <span style={label}>Book</span>
          <select value={book} onChange={(e) => setBook(e.target.value)} style={input}>
            <option value="">All books</option>
            {BOOKS.map((b) => <option key={b.name} value={b.name}>{b.name}</option>)}
          </select>
        </div>
        <div style={{ width: 110 }}>
          <span style={label}>Chapter</span>
          <input value={chapter} onChange={(e) => setChapter(e.target.value.replace(/\D/g, ""))} style={input} placeholder="Any" />
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <span style={label}>Search text</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load(1)} style={input} placeholder="Search English, Hebrew or Malayalam…" />
        </div>
        <button style={btn("primary")} onClick={() => load(1)}>Filter</button>
        <button style={btn("ghost")} onClick={() => { setBook(""); setChapter(""); setSearch(""); setPage(1); setTimeout(() => load(1), 0); }}>Clear</button>
      </div>

      {error && <p style={{ color: A.danger, marginBottom: 10 }}>{error}</p>}

      {/* Table */}
      <div style={{ fontSize: 13, color: A.inkFaint, marginBottom: 8 }}>
        {loading ? "Loading…" : data ? `Showing ${data.verses.length ? (page - 1) * PAGE_SIZE + 1 : 0}–${(page - 1) * PAGE_SIZE + (data.verses.length)} of ${data.total} verses · Page ${page} of ${totalPages}` : ""}
      </div>
      <div style={{ ...card, padding: 0, overflow: "hidden", marginBottom: 14 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
          <thead>
            <tr style={{ background: A.panel, textAlign: "left" }}>
              <th style={th}>Book</th><th style={th}>Ch</th><th style={th}>Vs</th>
              <th style={{ ...th, width: "34%" }}>English</th>
              <th style={{ ...th, width: "28%" }}>Malayalam</th>
              <th style={th}>Hebrew</th>
              <th style={{ ...th, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.verses.map((v) => (
              <tr key={v.id} style={{ borderTop: `1px solid ${A.panelEdge}`, verticalAlign: "top" }}>
                <td style={td}>{v.book}</td>
                <td style={td}>{v.chapter}</td>
                <td style={td}>{v.verse}</td>
                <td style={{ ...td, color: A.ink }}>{clip(v.osrText, 110)}</td>
                <td style={{ ...td, fontFamily: "'Noto Serif Malayalam', serif" }}>{v.translations.ml ? clip(v.translations.ml, 80) : <Faint>—</Faint>}</td>
                <td style={{ ...td }}>{v.hebrewText ? <span dir="rtl">{clip(v.hebrewText, 40)}</span> : <Faint>—</Faint>}</td>
                <td style={{ ...td, textAlign: "right", whiteSpace: "nowrap" }}>
                  <button style={{ ...btn("ghost"), padding: "5px 12px", fontSize: 12 }} onClick={() => setEditing(v)}>Edit</button>{" "}
                  <button style={{ ...btn("danger"), padding: "5px 12px", fontSize: 12 }} onClick={() => setConfirmDelete(v)}>Delete</button>
                </td>
              </tr>
            ))}
            {!loading && data?.verses.length === 0 && (
              <tr><td colSpan={7} style={{ ...td, textAlign: "center", padding: "2.5rem", color: A.inkFaint, fontStyle: "italic" }}>No verses match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pager */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button style={btn("ghost")} disabled={page <= 1 || loading} onClick={() => load(page - 1)}>← Previous</button>
        <span style={{ fontSize: 13, color: A.inkFaint }}>Page {page} of {totalPages}</span>
        <button style={btn("ghost")} disabled={page >= totalPages || loading} onClick={() => load(page + 1)}>Next →</button>
      </div>

      {editing && <EditModal verse={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(page); }} onError={setError} />}

      {confirmDelete && (
        <Modal onClose={() => setConfirmDelete(null)}>
          <div style={{ fontFamily: HEAD, fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Delete {confirmDelete.book} {confirmDelete.chapter}:{confirmDelete.verse}?</div>
          <p style={{ fontSize: 13.5, color: A.inkSoft, marginBottom: 16, lineHeight: 1.6 }}>
            This removes the verse and all its translations and commentary permanently.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button style={btn("ghost")} onClick={() => setConfirmDelete(null)}>Cancel</button>
            <button style={{ ...btn("danger"), background: A.danger, color: A.cream }} onClick={() => onDelete(confirmDelete)}>Delete verse</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Add form ────────────────────────────────────────────────────────────────────
function AddVerseForm({ onDone, onError }: { onDone: () => void; onError: (e: string) => void }) {
  const [book, setBook] = useState("Genesis");
  const [chapter, setChapter] = useState("");
  const [verse, setVerse] = useState("");
  const [english, setEnglish] = useState("");
  const [hebrew, setHebrew] = useState("");
  const [malayalam, setMalayalam] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    try {
      await createAdminVerse({
        book, chapter: Number(chapter), verse: Number(verse), osrText: english,
        hebrewText: hebrew || undefined,
        translations: malayalam ? { ml: malayalam } : undefined,
      });
      onDone();
    } catch (e) {
      onError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ ...card, marginBottom: 14, borderColor: A.gold }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
        <div style={{ minWidth: 180 }}>
          <span style={label}>Book</span>
          <select value={book} onChange={(e) => setBook(e.target.value)} style={input}>
            {BOOKS.map((b) => <option key={b.name} value={b.name}>{b.name}</option>)}
          </select>
        </div>
        <div style={{ width: 100 }}>
          <span style={label}>Chapter</span>
          <input value={chapter} onChange={(e) => setChapter(e.target.value.replace(/\D/g, ""))} style={input} />
        </div>
        <div style={{ width: 100 }}>
          <span style={label}>Verse</span>
          <input value={verse} onChange={(e) => setVerse(e.target.value.replace(/\D/g, ""))} style={input} />
        </div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <span style={label}>English text (required)</span>
        <textarea value={english} onChange={(e) => setEnglish(e.target.value)} rows={2} style={{ ...input, resize: "vertical", fontFamily: SERIF }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <span style={label}>Hebrew (optional)</span>
        <textarea dir="rtl" value={hebrew} onChange={(e) => setHebrew(e.target.value)} rows={2} style={{ ...input, resize: "vertical" }} />
      </div>
      <div style={{ marginBottom: 14 }}>
        <span style={label}>Malayalam (optional)</span>
        <textarea value={malayalam} onChange={(e) => setMalayalam(e.target.value)} rows={2} style={{ ...input, resize: "vertical", fontFamily: "'Noto Serif Malayalam', serif" }} />
      </div>
      <button style={btn("primary")} disabled={busy || !chapter || !verse || !english.trim()} onClick={submit}>
        {busy ? "Adding…" : "Add verse"}
      </button>
    </div>
  );
}

// ── Edit modal ──────────────────────────────────────────────────────────────────
function EditModal({ verse, onClose, onSaved, onError }: {
  verse: AdminVerse; onClose: () => void; onSaved: () => void; onError: (e: string) => void;
}) {
  const [english, setEnglish] = useState(verse.osrText);
  const [hebrew, setHebrew] = useState(verse.hebrewText ?? "");
  const [malayalam, setMalayalam] = useState(verse.translations.ml ?? "");
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      await updateAdminVerse(verse.id, {
        osrText: english,
        hebrewText: hebrew, // empty → cleared server-side
        translations: { ml: malayalam }, // empty → deletes the ml row
      });
      onSaved();
    } catch (e) {
      onError((e as Error).message);
      setBusy(false);
    }
  }

  return (
    <Modal onClose={onClose}>
      <div style={{ fontFamily: HEAD, fontSize: 19, fontWeight: 600, marginBottom: 2 }}>
        Edit {verse.book} {verse.chapter}:{verse.verse}
      </div>
      <p style={{ fontSize: 12, color: A.inkFaint, marginBottom: 16 }}>Book, chapter, and verse cannot change — delete and re-add to move a verse.</p>
      <div style={{ marginBottom: 12 }}>
        <span style={label}>English</span>
        <textarea value={english} onChange={(e) => setEnglish(e.target.value)} rows={3} style={{ ...input, resize: "vertical" }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <span style={label}>Hebrew (blank = remove)</span>
        <textarea dir="rtl" value={hebrew} onChange={(e) => setHebrew(e.target.value)} rows={2} style={{ ...input, resize: "vertical" }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <span style={label}>Malayalam (blank = remove)</span>
        <textarea value={malayalam} onChange={(e) => setMalayalam(e.target.value)} rows={3} style={{ ...input, resize: "vertical", fontFamily: "'Noto Serif Malayalam', serif" }} />
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button style={btn("ghost")} onClick={onClose}>Cancel</button>
        <button style={btn("primary")} disabled={busy || !english.trim()} onClick={save}>{busy ? "Saving…" : "Save changes"}</button>
      </div>
    </Modal>
  );
}

// ── Shared modal shell ─────────────────────────────────────────────────────────
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(30,24,14,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "1rem" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#FFFDF8", borderRadius: 16, border: `1px solid ${A.panelEdge}`, padding: "1.6rem 1.7rem", width: "min(620px, 100%)", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 30px 70px -20px rgba(0,0,0,0.45)" }}>
        {children}
      </div>
    </div>
  );
}

function Faint({ children }: { children: React.ReactNode }) {
  return <span style={{ color: A.inkFaint }}>{children}</span>;
}

function clip(s: string, n: number) {
  return s.length > n ? s.slice(0, n) + "…" : s;
}

const th: React.CSSProperties = { padding: "10px 14px", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: A.inkFaint, fontWeight: 600 };
const td: React.CSSProperties = { padding: "11px 14px", color: A.inkSoft, lineHeight: 1.55 };
