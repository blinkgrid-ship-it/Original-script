import { useRef, useState } from "react";
import { adminImport, type ImportPreview, type ImportResult } from "../../lib/api";
import { A, HEAD, BOOKS, card, label, input, btn } from "./adminTheme";

type Mode = "english" | "hebrew" | "translation";

const MODES: { value: Mode; title: string; desc: string }[] = [
  { value: "english", title: "English (ISR)", desc: "Creates new verses or updates existing English text. Use this FIRST for any new book." },
  { value: "hebrew", title: "Hebrew", desc: "Adds original-language text to verses that already exist." },
  { value: "translation", title: "Regional translation", desc: "Adds a translation (Malayalam, Tamil, …) to verses that already exist." },
];

// Upload flow: pick mode + target book (+ language) → drop file → PREVIEW (dry run,
// nothing written) → review counts/errors → CONFIRM commit. The book dropdown overrides
// the file's Book column entirely, so a translator writing "ഉല്പത്തി" instead of
// "Genesis" doesn't break the import.
export default function AdminUpload() {
  const [mode, setMode] = useState<Mode>("english");
  const [book, setBook] = useState("Genesis");
  const [lang, setLang] = useState("ml");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState<"preview" | "commit" | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  function reset() {
    setPreview(null);
    setResult(null);
    setError(null);
  }

  function pickFile(f: File | null) {
    reset();
    setFile(f);
  }

  async function run(action: "preview" | "commit") {
    if (!file) return;
    setBusy(action);
    setError(null);
    try {
      const res = await adminImport(action, file, mode, {
        book,
        languageCode: mode === "translation" ? lang : undefined,
      });
      if (action === "preview") setPreview(res);
      else {
        setResult(res);
        setPreview(null);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ fontFamily: HEAD, fontSize: "2.1rem", fontWeight: 600, marginBottom: 4 }}>Upload content</h1>
      <p style={{ color: A.inkSoft, marginBottom: "1.8rem" }}>
        Add or update verse content from a .xlsx, .csv, or .json file. Nothing is written until you confirm the preview.
      </p>

      {/* Mode cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 12, marginBottom: "1.4rem" }}>
        {MODES.map((m) => (
          <button key={m.value} onClick={() => { setMode(m.value); reset(); }}
            style={{
              ...card, textAlign: "left", cursor: "pointer",
              border: `1.5px solid ${mode === m.value ? A.emerald : A.panelEdge}`,
              background: mode === m.value ? "rgba(29,107,95,0.06)" : "#FFFDF8",
            }}>
            <div style={{ fontFamily: HEAD, fontSize: 16, fontWeight: 600, color: mode === m.value ? A.emeraldD : A.ink, marginBottom: 5 }}>{m.title}</div>
            <div style={{ fontSize: 12.5, color: A.inkSoft, lineHeight: 1.55 }}>{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Target selectors */}
      <div style={{ ...card, display: "flex", gap: 18, flexWrap: "wrap", alignItems: "flex-end", marginBottom: "1.4rem" }}>
        <div style={{ minWidth: 220 }}>
          <span style={label}>Target book</span>
          <select value={book} onChange={(e) => { setBook(e.target.value); reset(); }} style={input}>
            {BOOKS.map((b) => <option key={b.name} value={b.name}>{b.name}</option>)}
          </select>
        </div>
        {mode === "translation" && (
          <div style={{ minWidth: 160 }}>
            <span style={label}>Language code</span>
            <select value={lang} onChange={(e) => { setLang(e.target.value); reset(); }} style={input}>
              <option value="ml">ml — Malayalam</option>
              <option value="ta">ta — Tamil</option>
              <option value="hi">hi — Hindi</option>
            </select>
          </div>
        )}
        <p style={{ fontSize: 12, color: A.inkFaint, margin: 0, flex: 1, minWidth: 220 }}>
          The file's own Book column is ignored — the book you pick here is what gets imported,
          so translated or misspelled book names in the sheet can't cause errors.
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); pickFile(e.dataTransfer.files[0] ?? null); }}
        onClick={() => fileInput.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? A.emerald : A.goldSoft}`,
          background: dragOver ? "rgba(29,107,95,0.05)" : "rgba(216,199,160,0.08)",
          borderRadius: 16, padding: "2.6rem 1.5rem", textAlign: "center", cursor: "pointer", marginBottom: "1.4rem",
        }}
      >
        <div style={{ fontSize: 26, color: A.gold, marginBottom: 8 }}>⇪</div>
        {file ? (
          <>
            <div style={{ fontFamily: HEAD, fontSize: 17, color: A.emeraldD }}>{file.name}</div>
            <div style={{ fontSize: 12, color: A.inkFaint, marginTop: 4 }}>{(file.size / 1024).toFixed(0)} KB — click to choose a different file</div>
          </>
        ) : (
          <>
            <div style={{ fontFamily: HEAD, fontSize: 17, color: A.ink }}>Drop your file here or click to browse</div>
            <div style={{ fontSize: 12, color: A.inkFaint, marginTop: 4 }}>.xlsx · .csv · .json — max 5 MB</div>
          </>
        )}
        <input ref={fileInput} type="file" accept=".xlsx,.csv,.json" hidden
          onChange={(e) => pickFile(e.target.files?.[0] ?? null)} />
      </div>

      {error && <p style={{ color: A.danger, marginBottom: "1rem" }}>{error}</p>}

      {/* Step 1: preview */}
      {file && !preview && !result && (
        <button style={btn("primary")} disabled={busy !== null} onClick={() => run("preview")}>
          {busy === "preview" ? "Checking file…" : "Preview import (dry run)"}
        </button>
      )}

      {/* Step 2: review + confirm */}
      {preview && (
        <div style={{ ...card, borderColor: A.gold, marginBottom: "1rem" }}>
          <div style={{ fontFamily: HEAD, fontSize: 17, fontWeight: 600, marginBottom: 10 }}>Preview — nothing written yet</div>
          <div style={{ display: "flex", gap: 26, flexWrap: "wrap", marginBottom: 12 }}>
            <Num label="rows in file" v={preview.totalRows} color={A.ink} />
            <Num label="will be created" v={preview.toCreate} color={A.emerald} />
            <Num label="will be updated" v={preview.toUpdate} color={A.gold} />
            <Num label="rows with errors" v={preview.errorCount} color={preview.errorCount ? A.danger : A.inkFaint} />
          </div>
          {preview.errors.length > 0 && (
            <div style={{ maxHeight: 180, overflowY: "auto", border: `1px solid ${A.panelEdge}`, borderRadius: 9, padding: "8px 12px", fontSize: 12.5, marginBottom: 12 }}>
              {preview.errors.map((e, i) => (
                <div key={i} style={{ padding: "3px 0", color: A.inkSoft }}>
                  <span style={{ color: A.danger }}>Row {e.rowNumber}</span> ({e.ref}) — {e.error}
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <button style={btn("primary")} disabled={busy !== null || preview.toCreate + preview.toUpdate === 0} onClick={() => run("commit")}>
              {busy === "commit" ? "Importing…" : `Confirm import (${preview.toCreate + preview.toUpdate} rows)`}
            </button>
            <button style={btn("ghost")} onClick={reset}>Cancel</button>
          </div>
        </div>
      )}

      {/* Done */}
      {result && (
        <div style={{ ...card, borderColor: A.emerald }}>
          <div style={{ fontFamily: HEAD, fontSize: 17, fontWeight: 600, color: A.emeraldD, marginBottom: 10 }}>✓ Import complete</div>
          <div style={{ display: "flex", gap: 26, flexWrap: "wrap", marginBottom: 8 }}>
            <Num label="created" v={result.created} color={A.emerald} />
            <Num label="updated" v={result.updated} color={A.gold} />
            <Num label="skipped (errors)" v={result.skipped} color={result.skipped ? A.danger : A.inkFaint} />
          </div>
          <button style={btn("ghost")} onClick={() => { setFile(null); reset(); }}>Upload another file</button>
        </div>
      )}
    </div>
  );
}

function Num({ label: l, v, color }: { label: string; v: number; color: string }) {
  return (
    <div>
      <div style={{ fontFamily: HEAD, fontSize: "1.6rem", fontWeight: 600, color }}>{v}</div>
      <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: A.inkFaint }}>{l}</div>
    </div>
  );
}
