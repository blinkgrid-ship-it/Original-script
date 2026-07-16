import { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchChapter,
  fetchHighlights,
  saveHighlight,
  deleteHighlight,
  type Highlight,
} from "../lib/api";
import { useAuth } from "../context/AuthContext";

// ─────────────────────────────────────────────────────────────────────────────
// Eastern Theology University · ISR Bible Reader
// A self-contained "academic side" of the platform, kept visually distinct from
// Original Script: a warm parchment study-Bible palette (emerald + antique gold)
// instead of the dark community app. Verses read as a single flowing column with
// Malayalam nested under each English line — far easier on long chapters than the
// cramped side-by-side columns of the original mock. Only Genesis is seeded for
// now; every other book shows an "editorial team is preparing this" state.
// ─────────────────────────────────────────────────────────────────────────────

// Self-contained palette so this page looks the same regardless of the app theme.
const C = {
  paper:    "#F6F1E7", // aged page
  panel:    "#EFE7D6", // sidebar / cards
  panelEdge:"#E1D6BF",
  ink:      "#33291B", // primary serif text
  inkSoft:  "#6B5E48", // secondary text
  inkFaint: "#9A8B70", // labels / muted
  emerald:  "#1D6B5F", // accent — verse numbers, active state, links
  emeraldD: "#155049",
  gold:     "#B08948", // dividers / hover
  goldSoft: "#D8C7A0",
  mlText:   "#5A4E3C", // Malayalam tone
};

const SERIF = "'Lora', Georgia, 'Times New Roman', serif";
const HEAD  = "'Playfair Display', Georgia, serif";
const ML    = "'Noto Serif Malayalam', 'Lora', serif";
const HEB   = "'Frank Ruhl Libre', 'David Libre', 'Noto Serif Hebrew', 'Times New Roman', serif";

// 66-book canon with chapter counts. Only Genesis has content wired.
type Book = { name: string; chapters: number };
const OLD_TESTAMENT: Book[] = [
  { name: "Genesis", chapters: 50 }, { name: "Exodus", chapters: 40 }, { name: "Leviticus", chapters: 27 },
  { name: "Numbers", chapters: 36 }, { name: "Deuteronomy", chapters: 34 }, { name: "Joshua", chapters: 24 },
  { name: "Judges", chapters: 21 }, { name: "Ruth", chapters: 4 }, { name: "1 Samuel", chapters: 31 },
  { name: "2 Samuel", chapters: 24 }, { name: "1 Kings", chapters: 22 }, { name: "2 Kings", chapters: 25 },
  { name: "1 Chronicles", chapters: 29 }, { name: "2 Chronicles", chapters: 36 }, { name: "Ezra", chapters: 10 },
  { name: "Nehemiah", chapters: 13 }, { name: "Esther", chapters: 10 }, { name: "Job", chapters: 42 },
  { name: "Psalms", chapters: 150 }, { name: "Proverbs", chapters: 31 }, { name: "Ecclesiastes", chapters: 12 },
  { name: "Song of Songs", chapters: 8 }, { name: "Isaiah", chapters: 66 }, { name: "Jeremiah", chapters: 52 },
  { name: "Lamentations", chapters: 5 }, { name: "Ezekiel", chapters: 48 }, { name: "Daniel", chapters: 12 },
  { name: "Hosea", chapters: 14 }, { name: "Joel", chapters: 3 }, { name: "Amos", chapters: 9 },
  { name: "Obadiah", chapters: 1 }, { name: "Jonah", chapters: 4 }, { name: "Micah", chapters: 7 },
  { name: "Nahum", chapters: 3 }, { name: "Habakkuk", chapters: 3 }, { name: "Zephaniah", chapters: 3 },
  { name: "Haggai", chapters: 2 }, { name: "Zechariah", chapters: 14 }, { name: "Malachi", chapters: 4 },
];
const NEW_TESTAMENT: Book[] = [
  { name: "Matthew", chapters: 28 }, { name: "Mark", chapters: 16 }, { name: "Luke", chapters: 24 },
  { name: "John", chapters: 21 }, { name: "Acts", chapters: 28 }, { name: "Romans", chapters: 16 },
  { name: "1 Corinthians", chapters: 16 }, { name: "2 Corinthians", chapters: 13 }, { name: "Galatians", chapters: 6 },
  { name: "Ephesians", chapters: 6 }, { name: "Philippians", chapters: 4 }, { name: "Colossians", chapters: 4 },
  { name: "1 Thessalonians", chapters: 5 }, { name: "2 Thessalonians", chapters: 3 }, { name: "1 Timothy", chapters: 6 },
  { name: "2 Timothy", chapters: 4 }, { name: "Titus", chapters: 3 }, { name: "Philemon", chapters: 1 },
  { name: "Hebrews", chapters: 13 }, { name: "James", chapters: 5 }, { name: "1 Peter", chapters: 5 },
  { name: "2 Peter", chapters: 3 }, { name: "1 John", chapters: 5 }, { name: "2 John", chapters: 1 },
  { name: "3 John", chapters: 1 }, { name: "Jude", chapters: 1 }, { name: "Revelation", chapters: 22 },
];

// "regional" is a display-mode sentinel (show whichever regional language is
// selected), not a language code itself — the actual code lives in `regionalLang`
// state below, so the third pill can point at any imported language.
type Lang = "both" | "en" | "regional";

// English display names for known ISO 639-1 codes, since the reader (you) can't read
// the native scripts to tell them apart at a glance. Unknown codes just show as-is
// (uppercased) rather than breaking — add a name here as new languages get imported.
const LANGUAGE_NAMES: Record<string, string> = {
  ml: "Malayalam", ta: "Tamil", hi: "Hindi", te: "Telugu", kn: "Kannada",
  bn: "Bengali", gu: "Gujarati", mr: "Marathi", pa: "Punjabi", ur: "Urdu",
};
function languageLabel(code: string): string {
  return LANGUAGE_NAMES[code] ?? code.toUpperCase();
}

// ── Highlighter palette + helpers ───────────────────────────────────────────────
// Six presets tuned to read well on the ETU parchment background; the colour wheel
// covers everything else.
const SWATCHES = ["#F5C542", "#7FC29B", "#6FB3D6", "#E39BC7", "#E88B6B", "#B79BE3"];

// Arbitrary hex (from a swatch or the colour wheel) → rgba, so a highlight fill can be
// laid at a readable opacity over the verse text without hiding it.
function withAlpha(hex: string, a: number): string {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// Style applied to a verse's text block from its highlight (if any).
function hlTextStyle(hl?: Highlight): React.CSSProperties {
  if (!hl) return {};
  if (hl.style === "underline") {
    return { borderBottom: `3px solid ${hl.color}`, paddingBottom: 3 };
  }
  return {
    background: withAlpha(hl.color, 0.4),
    borderRadius: 5,
    padding: "0.1em 0.25em",
    boxDecorationBreak: "clone",
    WebkitBoxDecorationBreak: "clone",
  };
}

// Rendering-shape verse — mapped from the API's ChapterVerse so the JSX below barely
// had to change when this page moved off the static file.
interface DisplayVerse {
  number: number;
  english: string;
  hebrew: string | null;
  // Keyed by ISO language code — whatever's actually been imported, not just Malayalam.
  translations: Record<string, string>;
  fingerprint: string | null; // stable id highlights key off; null → not highlightable
}

export default function ETUReaderPage() {
  const navigate = useNavigate();
  // book/chapter/verse are the verse's stable identity, lived in the URL — not
  // useState — so /etu/genesis/1/1 is a real, shareable, deep-linkable address
  // (this is what lets the university course platform link straight to a verse).
  const params = useParams<{ book: string; chapter: string; verse?: string }>();
  const urlChapter = Number(params.chapter) || 1;

  const [testament, setTestament] = useState<"old" | "new">("old");
  const [lang, setLang] = useState<Lang>("both");
  const [regionalLang, setRegionalLang] = useState("ml");
  // Scroll (immersive) is the default reading mode per the locked "mobile-first
  // scrolling UI" decision — Column stays available as an alternate view.
  const [readMode, setReadMode] = useState<"column" | "immersive">("immersive");
  const [search, setSearch] = useState("");
  const [jumpVerse, setJumpVerse] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [verses, setVerses] = useState<DisplayVerse[] | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  // This chapter's highlights, keyed by verse fingerprint, for O(1) lookup while rendering.
  const [highlights, setHighlights] = useState<Record<string, Highlight>>({});
  // Fingerprint of the verse whose highlight toolbar is open (null = closed).
  const [activeFp, setActiveFp] = useState<string | null>(null);
  // Which style the next colour pick applies. Seeded from the verse's existing highlight.
  const [pickStyle, setPickStyle] = useState<"highlight" | "underline">("highlight");
  // "My Highlights" slide-over.
  const [panelOpen, setPanelOpen] = useState(false);
  const [allHighlights, setAllHighlights] = useState<Highlight[] | null>(null);

  const books = testament === "old" ? OLD_TESTAMENT : NEW_TESTAMENT;
  const activeBook =
    [...OLD_TESTAMENT, ...NEW_TESTAMENT].find(
      (b) => b.name.toLowerCase() === (params.book ?? "genesis").toLowerCase(),
    ) ?? OLD_TESTAMENT[0];
  const book = activeBook.name;
  const chapter = Math.min(Math.max(urlChapter, 1), activeBook.chapters);

  // Every language actually present in this chapter's data — not a hardcoded list, so
  // a newly imported language (Tamil, Hindi, ...) shows up in the picker automatically
  // the moment its verse_translations rows exist, with no code change here.
  const availableLanguages = useMemo(() => {
    const codes = new Set<string>();
    for (const v of verses ?? []) for (const code of Object.keys(v.translations)) codes.add(code);
    return [...codes].sort();
  }, [verses]);

  // Keep the selected regional language valid as chapters change — falls back to
  // whatever's actually available instead of silently showing nothing.
  useEffect(() => {
    if (availableLanguages.length === 0) return;
    if (!availableLanguages.includes(regionalLang)) setRegionalLang(availableLanguages[0]);
  }, [availableLanguages, regionalLang]);

  // Fetch this chapter from the real database (Verse + VerseTranslation) whenever the
  // URL's book/chapter changes. `verses: null` means either loading or genuinely no
  // content yet — both render the same "not uploaded" state, just gated by `loading`.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchChapter(book, chapter)
      .then((data) => {
        if (cancelled) return;
        setVerses(
          data.verses.length
            ? data.verses.map((v) => ({
                number: v.verseNumber,
                english: v.osrText,
                hebrew: v.hebrewText,
                translations: v.translations,
                fingerprint: v.verseFingerprint,
              }))
            : null,
        );
      })
      .catch(() => {
        if (!cancelled) setVerses(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [book, chapter]);

  // Load this user's highlights for the chapter whenever the chapter (or auth) changes.
  // Signed-out readers get an empty map and no highlight UI.
  useEffect(() => {
    if (!user) {
      setHighlights({});
      return;
    }
    let cancelled = false;
    fetchHighlights({ book, chapter })
      .then((list) => {
        if (cancelled) return;
        const map: Record<string, Highlight> = {};
        for (const h of list) map[`${h.verseFingerprint}|${h.lang}`] = h;
        setHighlights(map);
      })
      .catch(() => {
        /* non-fatal: reading still works without highlights */
      });
    return () => {
      cancelled = true;
    };
  }, [book, chapter, user]);

  // Close any open highlight toolbar when the chapter changes.
  useEffect(() => {
    setActiveFp(null);
  }, [book, chapter]);

  // Close the regional-language menu on outside click.
  useEffect(() => {
    if (!langMenuOpen) return;
    function onDocClick(e: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) setLangMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [langMenuOpen]);

  // Highlights are keyed by "fingerprint|lang" so English/Hebrew/regional each carry
  // their own independent color and style for the same verse.
  function hlKey(fp: string, lang: string) {
    return `${fp}|${lang}`;
  }

  // Apply (create/update) a highlight for one language line — optimistic, reverts on failure.
  async function applyHighlight(v: DisplayVerse, lang: string, color: string, style: "highlight" | "underline") {
    if (!v.fingerprint) return;
    const fp = v.fingerprint;
    const key = hlKey(fp, lang);
    const prev = highlights[key];
    const optimistic: Highlight = {
      verseFingerprint: fp, lang, book, chapter, verse: v.number, color, style, updatedAt: "",
    };
    setHighlights((h) => ({ ...h, [key]: optimistic }));
    try {
      const saved = await saveHighlight(fp, color, style, lang);
      setHighlights((h) => ({ ...h, [key]: saved }));
    } catch {
      setHighlights((h) => {
        const next = { ...h };
        if (prev) next[key] = prev;
        else delete next[key];
        return next;
      });
    }
  }

  // Remove a highlight for one language line — optimistic, reverts on failure.
  async function removeHighlight(fp: string, lang: string) {
    const key = hlKey(fp, lang);
    const prev = highlights[key];
    setHighlights((h) => {
      const next = { ...h };
      delete next[key];
      return next;
    });
    try {
      await deleteHighlight(fp, lang);
    } catch {
      if (prev) setHighlights((h) => ({ ...h, [key]: prev }));
    }
  }

  // Open the highlight toolbar for a verse. No-op when signed out or the verse has no
  // fingerprint. Per-line style/color pickers are seeded individually in the toolbar
  // itself, since each visible line (EN/HE/regional) can hold a different highlight.
  function openToolbar(v: DisplayVerse) {
    if (!user || !v.fingerprint) return;
    setActiveFp((cur) => (cur === v.fingerprint ? null : v.fingerprint));
  }

  // Open the "My Highlights" panel and (re)load the full list.
  function openPanel() {
    setPanelOpen(true);
    setAllHighlights(null);
    fetchHighlights()
      .then(setAllHighlights)
      .catch(() => setAllHighlights([]));
  }

  const activeVerse = activeFp ? verses?.find((v) => v.fingerprint === activeFp) ?? null : null;

  // Which language lines the toolbar should offer a swatch row for — matches whatever
  // is actually visible under the current pill selection, so you're never offered a
  // color picker for a line you can't see.
  const toolbarLines = useMemo(() => {
    if (!activeVerse) return [];
    if (lang === "en") return [{ code: "en", label: "English" }];
    if (lang === "regional") return [{ code: regionalLang, label: languageLabel(regionalLang) }];
    // "both" — English always, Hebrew only when this verse actually has it.
    const lines = [{ code: "en", label: "English" }];
    if (activeVerse.hebrew) lines.push({ code: "he", label: "Hebrew" });
    return lines;
  }, [activeVerse, lang, regionalLang]);

  // Reset scroll when the chapter changes.
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [book, chapter]);

  // A verse in the URL (e.g. /etu/genesis/1/5) highlights + scrolls to it on load.
  useEffect(() => {
    const v = params.verse ? parseInt(params.verse, 10) : null;
    if (v) setJumpVerse(v);
  }, [params.verse]);

  // Clear a verse highlight shortly after jumping to it.
  useEffect(() => {
    if (jumpVerse == null) return;
    const el = document.getElementById(`v-${jumpVerse}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    const t = setTimeout(() => setJumpVerse(null), 2600);
    return () => clearTimeout(t);
  }, [jumpVerse]);

  function selectBook(name: string) {
    navigate(`/etu/${name.toLowerCase()}/1`);
    setSidebarOpen(false);
  }

  function goToChapter(n: number) {
    navigate(`/etu/${book.toLowerCase()}/${n}`);
    setSidebarOpen(false);
  }

  // Accepts "3:5", "gen 3:5", "genesis 3:5" — jumps within Genesis for the demo.
  function runSearch() {
    const m = search.trim().match(/(\d+)\s*[:.\s]\s*(\d+)/);
    if (!m) return;
    const ch = parseInt(m[1], 10);
    const v = parseInt(m[2], 10);
    if (ch >= 1 && ch <= 50) {
      navigate(`/etu/genesis/${ch}/${v}`);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: C.paper, color: C.ink, display: "flex", flexDirection: "column", fontFamily: SERIF }}>
      {/* ── Top bar ── */}
      <header style={{ background: C.emeraldD, color: "#F6F1E7", padding: "0.85rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem", position: "sticky", top: 0, zIndex: 20 }}>
        <button onClick={() => setSidebarOpen((s) => !s)} style={{ ...iconBtn, display: "inline-flex" }} className="etu-menu" aria-label="Toggle books">☰</button>
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", minWidth: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: C.gold, color: C.emeraldD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>✦</div>
          <div style={{ lineHeight: 1.15, minWidth: 0 }}>
            <div style={{ fontFamily: HEAD, fontSize: 16, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Eastern Theology University</div>
            <div style={{ fontSize: 10, letterSpacing: "0.14em", color: C.goldSoft, textTransform: "uppercase" }}>ISR Bible · Free Academic Access</div>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Search */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runSearch()}
          placeholder="Search scripture…  (e.g. 3:5)"
          style={{ background: "rgba(246,241,231,0.12)", border: "1px solid rgba(246,241,231,0.25)", borderRadius: 20, padding: "7px 16px", color: "#F6F1E7", fontSize: 13, width: 210, fontFamily: SERIF }}
          className="etu-search"
        />

        {/* Language toggle — the original pill row. The third pill opens a custom
            styled menu (not a native <select>) listing whatever languages
            availableLanguages actually finds in this chapter's data — a newly
            imported language just appears here. */}
        <div style={{ display: "flex", background: "rgba(246,241,231,0.1)", borderRadius: 20, padding: 3, gap: 2 }} className="etu-lang">
          <button onClick={() => setLang("both")} style={{ border: "none", cursor: "pointer", borderRadius: 16, padding: "5px 12px", fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", fontFamily: SERIF, background: lang === "both" ? C.gold : "transparent", color: lang === "both" ? C.emeraldD : C.goldSoft }}>
            EN + HE
          </button>
          <button onClick={() => setLang("en")} style={{ border: "none", cursor: "pointer", borderRadius: 16, padding: "5px 12px", fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", fontFamily: SERIF, background: lang === "en" ? C.gold : "transparent", color: lang === "en" ? C.emeraldD : C.goldSoft }}>
            EN
          </button>
          {availableLanguages.length > 0 && (
            <div ref={langMenuRef} style={{ position: "relative" }}>
              <button
                onClick={() => { setLang("regional"); setLangMenuOpen((o) => !o); }}
                aria-label="Regional language"
                aria-haspopup="listbox"
                aria-expanded={langMenuOpen}
                style={{
                  border: "none", cursor: "pointer", borderRadius: 16, padding: "5px 10px 5px 12px",
                  fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", fontFamily: SERIF,
                  background: lang === "regional" ? C.gold : "transparent",
                  color: lang === "regional" ? C.emeraldD : C.goldSoft,
                  display: "inline-flex", alignItems: "center", gap: 4,
                }}
              >
                {languageLabel(regionalLang)}
                <span style={{ fontSize: 9, transform: langMenuOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>▾</span>
              </button>
              {langMenuOpen && (
                <div role="listbox" style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 30,
                  background: C.paper, border: `1px solid ${C.panelEdge}`, borderRadius: 12,
                  boxShadow: "0 10px 30px rgba(51,41,27,0.28)", padding: 5, minWidth: 150,
                  display: "flex", flexDirection: "column", gap: 2,
                }}>
                  {availableLanguages.map((code) => {
                    const selected = code === regionalLang;
                    return (
                      <button
                        key={code}
                        role="option"
                        aria-selected={selected}
                        onClick={() => { setRegionalLang(code); setLang("regional"); setLangMenuOpen(false); }}
                        style={{
                          border: "none", cursor: "pointer", textAlign: "left", borderRadius: 8,
                          padding: "7px 10px", fontSize: 13, fontFamily: SERIF,
                          background: selected ? C.emerald : "transparent",
                          color: selected ? "#F6F1E7" : C.ink,
                          fontWeight: selected ? 600 : 400,
                        }}
                      >
                        {languageLabel(code)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reading-mode toggle — Scroll is the default, so it's shown first (left). */}
        <div style={{ display: "flex", background: "rgba(246,241,231,0.1)", borderRadius: 20, padding: 3, gap: 2 }} className="etu-mode">
          {([["immersive", "⛶ Scroll"], ["column", "☰ Column"]] as const).map(([val, label]) => (
            <button key={val} onClick={() => setReadMode(val)} style={{ border: "none", cursor: "pointer", borderRadius: 16, padding: "5px 12px", fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", fontFamily: SERIF, background: readMode === val ? C.gold : "transparent", color: readMode === val ? C.emeraldD : C.goldSoft }}>{label}</button>
          ))}
        </div>

        {user && (
          <button onClick={openPanel} style={iconBtn} title="My highlights" aria-label="My highlights">🖍️</button>
        )}
        <button onClick={() => navigate("/home")} style={iconBtn} title="Back to Original Script">↩</button>
      </header>

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* ── Sidebar ── */}
        <aside
          className="etu-sidebar"
          data-open={sidebarOpen ? "" : undefined}
          style={{
            width: 270, background: C.panel, borderRight: `1px solid ${C.panelEdge}`,
            display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto",
            ...(sidebarOpen ? { position: "fixed", inset: "58px 0 0 0", zIndex: 15, width: "min(300px, 82vw)" } : {}),
          }}
        >
          <div style={{ padding: "1.25rem 1rem 0" }}>
            <div style={{ fontSize: 10, letterSpacing: "0.16em", color: C.inkFaint, textTransform: "uppercase", marginBottom: "0.8rem" }}>Books</div>
            <div style={{ display: "flex", gap: 6, marginBottom: "1rem" }}>
              {(["old", "new"] as const).map((t) => (
                <button key={t} onClick={() => setTestament(t)} style={{ flex: 1, cursor: "pointer", borderRadius: 18, padding: "7px 0", fontSize: 12, fontWeight: 600, fontFamily: SERIF, border: `1px solid ${testament === t ? C.emerald : C.panelEdge}`, background: testament === t ? C.emerald : "transparent", color: testament === t ? "#F6F1E7" : C.inkSoft }}>
                  {t === "old" ? "Old Testament" : "New"}
                </button>
              ))}
            </div>
          </div>

          <div style={{ padding: "0 0.5rem", flex: "0 0 auto" }}>
            {books.map((b) => {
              const active = b.name === book;
              const hasContent = b.name === "Genesis";
              return (
                <button key={b.name} onClick={() => selectBook(b.name)}
                  style={{ width: "100%", textAlign: "left", cursor: "pointer", border: "none", background: active ? C.goldSoft : "transparent", borderRadius: 8, padding: "9px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", color: active ? C.emeraldD : C.ink, fontFamily: SERIF }}>
                  <span style={{ fontSize: 14, fontWeight: active ? 600 : 400 }}>
                    {b.name}
                    {hasContent && <span style={{ color: C.emerald, marginLeft: 6, fontSize: 11 }}>●</span>}
                  </span>
                  <span style={{ fontSize: 11, color: C.inkFaint }}>{b.chapters}</span>
                </button>
              );
            })}
          </div>

          {/* Chapter grid */}
          <div style={{ padding: "1rem", marginTop: "auto", borderTop: `1px solid ${C.panelEdge}` }}>
            <div style={{ fontSize: 10, letterSpacing: "0.16em", color: C.inkFaint, textTransform: "uppercase", marginBottom: "0.7rem" }}>{activeBook.name} · Chapters</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 5 }}>
              {Array.from({ length: activeBook.chapters }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => goToChapter(n)}
                  style={{ cursor: "pointer", borderRadius: 6, padding: "6px 0", fontSize: 12, fontFamily: SERIF, border: `1px solid ${chapter === n ? C.emerald : C.panelEdge}`, background: chapter === n ? C.emerald : C.paper, color: chapter === n ? "#F6F1E7" : C.inkSoft }}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Reading pane ── */}
        {readMode === "immersive" && verses ? (
          <main
            ref={mainRef}
            style={{
              flex: 1, overflowY: "auto", height: "calc(100vh - 58px)",
              scrollSnapType: "y mandatory", scrollBehavior: "smooth",
              background: `radial-gradient(circle at 50% 30%, ${C.panel}, ${C.paper} 70%)`,
            }}
          >
            {/* Title section */}
            <section style={{ scrollSnapAlign: "start", minHeight: "calc(100vh - 58px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem" }}>
              <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.emerald, marginBottom: "1.25rem" }}>ISR Translation</span>
              <h1 style={{ fontFamily: HEAD, fontSize: "clamp(2.6rem, 9vw, 5rem)", color: C.ink, fontWeight: 600, lineHeight: 1 }}>{book}</h1>
              <p style={{ fontFamily: HEAD, fontStyle: "italic", fontSize: "clamp(1.2rem, 4vw, 1.9rem)", color: C.inkFaint, marginTop: "0.6rem" }}>Chapter {chapter}</p>
              <div style={{ marginTop: "2.5rem", color: C.gold, fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", animation: "etu-bob 2s ease-in-out infinite" }}>Scroll to begin ↓</div>
            </section>

            {/* One verse per screen */}
            {verses.map((v) => {
              const highlighted = jumpVerse === v.number;
              return (
                <section key={v.number} id={`v-${v.number}`}
                  style={{ scrollSnapAlign: "start", minHeight: "calc(100vh - 58px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "clamp(2rem, 8vh, 6rem) clamp(1.5rem, 8vw, 6rem)", position: "relative" }}>
                  {/* Big faint verse number watermark */}
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ root: mainRef, amount: 0.5 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{ position: "absolute", top: "clamp(1rem, 6vh, 4rem)", fontFamily: HEAD, fontSize: "clamp(5rem, 18vw, 11rem)", fontWeight: 700, color: highlighted ? "rgba(176,137,72,0.28)" : "rgba(29,107,95,0.09)", lineHeight: 1, transition: "color 0.5s", pointerEvents: "none", userSelect: "none" }}>{v.number}</motion.span>
                  <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ root: mainRef, amount: 0.55 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => openToolbar(v)}
                    style={{ maxWidth: 720, position: "relative", zIndex: 1, cursor: "default" }}>
                    <span style={{ display: "block", color: C.emerald, fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", marginBottom: "1.5rem" }}>{book.toUpperCase()} {chapter}:{v.number}</span>
                    {lang === "both" && (
                      v.hebrew
                        ? <p dir="rtl" style={{ fontFamily: HEB, fontSize: "clamp(1.7rem, 4.2vw, 2.5rem)", lineHeight: 1.95, color: C.ink, fontWeight: 500 }}>
                            <span style={v.fingerprint ? hlTextStyle(highlights[hlKey(v.fingerprint, "he")]) : undefined}>{v.hebrew}</span>
                          </p>
                        : <p style={{ fontSize: 15, fontStyle: "italic", color: C.inkFaint }}>Hebrew text for this verse is being added by the editorial team.</p>
                    )}
                    {lang !== "regional" && (
                      <p style={{ fontFamily: SERIF, fontSize: "clamp(1.4rem, 3.4vw, 2.1rem)", lineHeight: 1.6, color: C.ink, marginTop: lang === "both" ? "1.5rem" : 0 }}>
                        <span style={v.fingerprint ? hlTextStyle(highlights[hlKey(v.fingerprint, "en")]) : undefined}>{v.english}</span>
                      </p>
                    )}
                    {lang === "regional" && (
                      v.translations[regionalLang]
                        ? <p style={{ fontFamily: ML, fontSize: "clamp(1.25rem, 3vw, 1.85rem)", lineHeight: 1.8, color: C.mlText }}>
                            <span style={v.fingerprint ? hlTextStyle(highlights[hlKey(v.fingerprint, regionalLang)]) : undefined}>{v.translations[regionalLang]}</span>
                          </p>
                        : <p style={{ fontSize: 15, fontStyle: "italic", color: C.inkFaint }}>{languageLabel(regionalLang)} for this verse is being added by the editorial team.</p>
                    )}
                  </motion.div>
                </section>
              );
            })}

            {/* Closing section: deep study + chapter nav */}
            <section style={{ scrollSnapAlign: "start", minHeight: "calc(100vh - 58px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem clamp(1.5rem, 8vw, 6rem)", gap: "1.5rem" }}>
              <div style={{ fontSize: 34 }}>✦</div>
              <p style={{ fontFamily: HEAD, fontStyle: "italic", fontSize: "clamp(1.3rem, 4vw, 1.9rem)", color: C.inkSoft, textAlign: "center" }}>End of {book} {chapter}</p>
              <button onClick={() => navigate(`/codex/genesis/${chapter}/1`)}
                style={{ cursor: "pointer", borderRadius: 14, padding: "0.9rem 1.6rem", border: `1px solid ${C.emerald}`, background: "rgba(29,107,95,0.06)", fontFamily: HEAD, fontSize: 16, color: C.ink }}>
                Study {book} {chapter} verse-by-verse →
              </button>
              <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                <button disabled={chapter <= 1} onClick={() => goToChapter(chapter - 1)} style={navBtn(chapter <= 1)}>← Previous</button>
                <button disabled={chapter >= activeBook.chapters} onClick={() => goToChapter(chapter + 1)} style={navBtn(chapter >= activeBook.chapters)}>Next →</button>
              </div>
            </section>
          </main>
        ) : (
        <main ref={mainRef} style={{ flex: 1, overflowY: "auto", padding: "2.5rem clamp(1.25rem, 6vw, 4rem) 5rem" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            {/* Chapter heading */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "0.4rem" }}>
              <h1 style={{ fontFamily: HEAD, fontSize: "clamp(2rem, 5vw, 2.9rem)", color: C.ink, fontWeight: 600 }}>{book}</h1>
              <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: C.emerald, border: `1px solid ${C.emerald}`, borderRadius: 16, padding: "4px 12px" }}>ISR Translation</span>
            </div>
            <p style={{ fontFamily: HEAD, fontStyle: "italic", fontSize: 18, color: C.inkFaint, marginBottom: "2rem" }}>Chapter {chapter}</p>

            {loading ? (
              <div style={{ textAlign: "center", padding: "4rem 1rem", color: C.inkFaint, fontStyle: "italic" }}>
                Loading chapter…
              </div>
            ) : verses ? (
              <div>
                {verses.map((v) => {
                  const highlighted = jumpVerse === v.number;
                  return (
                    <div key={v.number} id={`v-${v.number}`}
                      onClick={() => openToolbar(v)}
                      style={{ display: "flex", gap: "0.9rem", padding: "0.85rem 0.9rem", marginBottom: 2, borderRadius: 10, borderBottom: `1px solid ${C.panelEdge}`, background: highlighted ? C.goldSoft : "transparent", transition: "background 0.4s", cursor: "default" }}>
                      <span style={{ color: C.emerald, fontSize: 12, fontWeight: 700, minWidth: 22, textAlign: "right", paddingTop: 5, fontFamily: SERIF }}>{v.number}</span>
                      <div style={{ flex: 1 }}>
                        {lang === "both" && (
                          v.hebrew
                            ? <p dir="rtl" style={{ fontFamily: HEB, fontSize: 20, lineHeight: 1.9, color: C.ink, fontWeight: 500 }}>
                                <span style={v.fingerprint ? hlTextStyle(highlights[hlKey(v.fingerprint, "he")]) : undefined}>{v.hebrew}</span>
                              </p>
                            : <p style={{ fontSize: 13, fontStyle: "italic", color: C.inkFaint }}>Hebrew text for this verse is being added by the editorial team.</p>
                        )}
                        {lang !== "regional" && (
                          <p style={{ fontFamily: SERIF, fontSize: 17, lineHeight: 1.85, color: C.ink, marginTop: lang === "both" ? 6 : 0 }}>
                            <span style={v.fingerprint ? hlTextStyle(highlights[hlKey(v.fingerprint, "en")]) : undefined}>{v.english}</span>
                          </p>
                        )}
                        {lang === "regional" && (
                          v.translations[regionalLang]
                            ? <p style={{ fontFamily: ML, fontSize: 16.5, lineHeight: 2, color: C.mlText }}>
                                <span style={v.fingerprint ? hlTextStyle(highlights[hlKey(v.fingerprint, regionalLang)]) : undefined}>{v.translations[regionalLang]}</span>
                              </p>
                            : <p style={{ fontSize: 13, fontStyle: "italic", color: C.inkFaint }}>{languageLabel(regionalLang)} for this verse is being added by the editorial team.</p>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Deep-study link — bridges to the OSR 8-jar reader */}
                <button onClick={() => navigate(`/codex/genesis/${chapter}/1`)}
                  style={{ marginTop: "1.75rem", width: "100%", textAlign: "left", cursor: "pointer", borderRadius: 14, padding: "1.15rem 1.35rem", border: `1px solid ${C.emerald}`, background: "rgba(29,107,95,0.06)" }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: C.emerald, marginBottom: 4 }}>✦ Deep Study · Commentary Jars</div>
                  <div style={{ fontFamily: HEAD, fontSize: 18, color: C.ink }}>Study {book} {chapter} verse-by-verse →</div>
                  <div style={{ fontSize: 13, color: C.inkSoft, marginTop: 3 }}>Word study, source layer, historical context, science &amp; theology — the full academic commentary.</div>
                </button>
              </div>
            ) : (
              // Book without content yet (matches the "not uploaded" state).
              <div style={{ textAlign: "center", padding: "4rem 1rem", border: `1px dashed ${C.panelEdge}`, borderRadius: 16, marginTop: "1rem" }}>
                <div style={{ fontSize: 34, marginBottom: "1rem" }}>📜</div>
                <p style={{ fontFamily: HEAD, fontSize: 22, fontStyle: "italic", color: C.inkSoft, marginBottom: "0.6rem" }}>This chapter has not been uploaded yet.</p>
                <p style={{ fontSize: 14, color: C.inkFaint }}>Content is added by our editorial team. Check back soon.</p>
              </div>
            )}

            {/* Prev / next chapter */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2.5rem" }}>
              <button disabled={chapter <= 1} onClick={() => goToChapter(chapter - 1)} style={navBtn(chapter <= 1)}>← Previous</button>
              <span style={{ fontSize: 12, color: C.inkFaint, alignSelf: "center", fontStyle: "italic" }}>Chapter {chapter} of {activeBook.chapters}</span>
              <button disabled={chapter >= activeBook.chapters} onClick={() => goToChapter(chapter + 1)} style={navBtn(chapter >= activeBook.chapters)}>Next →</button>
            </div>
          </div>
        </main>
        )}
      </div>

      {/* ── Highlight toolbar (appears when a verse is tapped) ── */}
      {activeVerse && activeVerse.fingerprint && (
        <>
          {/* click-away backdrop */}
          <div onClick={() => setActiveFp(null)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
          <div style={{
            position: "fixed", left: "50%", bottom: "1.25rem", transform: "translateX(-50%)", zIndex: 41,
            background: C.paper, border: `1px solid ${C.panelEdge}`, borderRadius: 16,
            boxShadow: "0 10px 40px rgba(51,41,27,0.28)", padding: "0.85rem 1rem",
            display: "flex", flexDirection: "column", gap: "0.7rem", width: "min(420px, calc(100vw - 2rem))",
          }}>
            {/* header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: SERIF, fontSize: 13, fontWeight: 700, color: C.emeraldD }}>
                {book} {chapter}:{activeVerse.number}
              </span>
              <button onClick={() => setActiveFp(null)} style={{ border: "none", background: "none", cursor: "pointer", color: C.inkFaint, fontSize: 18, lineHeight: 1 }} aria-label="Close">×</button>
            </div>

            {/* style toggle — applies to whichever line's swatch you click next */}
            <div style={{ display: "flex", background: C.panel, borderRadius: 12, padding: 3, gap: 2 }}>
              {([["highlight", "🖍 Highlight"], ["underline", "⎁ Underline"]] as const).map(([val, label]) => (
                <button key={val} onClick={() => setPickStyle(val)}
                  style={{ flex: 1, border: "none", cursor: "pointer", borderRadius: 10, padding: "6px 10px", fontSize: 12, fontWeight: 600, fontFamily: SERIF, background: pickStyle === val ? C.emerald : "transparent", color: pickStyle === val ? C.paper : C.inkSoft }}>
                  {label}
                </button>
              ))}
            </div>

            {/* One swatch row per visible line — English and Hebrew (or regional) each
                carry their own independent color/style. */}
            {toolbarLines.map((line) => {
              const key = hlKey(activeVerse.fingerprint!, line.code);
              const current = highlights[key];
              return (
                <div key={line.code} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.inkFaint }}>{line.label}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    {SWATCHES.map((c) => {
                      const selected = current?.color?.toLowerCase() === c.toLowerCase();
                      return (
                        <button key={c} onClick={() => applyHighlight(activeVerse, line.code, c, pickStyle)} title={c}
                          style={{ width: 26, height: 26, borderRadius: "50%", background: c, cursor: "pointer",
                            border: selected ? `3px solid ${C.emeraldD}` : `2px solid ${C.panelEdge}` }} />
                      );
                    })}
                    {/* colour wheel */}
                    <label title="Custom colour" style={{ width: 26, height: 26, borderRadius: "50%", cursor: "pointer",
                      border: `2px solid ${C.panelEdge}`, display: "inline-flex", alignItems: "center", justifyContent: "center",
                      background: "conic-gradient(red, orange, yellow, lime, cyan, blue, magenta, red)", position: "relative", overflow: "hidden" }}>
                      <input type="color"
                        defaultValue={current?.color ?? "#F5C542"}
                        onChange={(e) => applyHighlight(activeVerse, line.code, e.target.value, pickStyle)}
                        style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", border: "none", padding: 0 }} />
                    </label>

                    <div style={{ flex: 1 }} />

                    {current && (
                      <button onClick={() => removeHighlight(activeVerse.fingerprint!, line.code)}
                        style={{ border: `1px solid ${C.panelEdge}`, background: "transparent", cursor: "pointer", borderRadius: 10, padding: "5px 10px", fontSize: 11, fontWeight: 600, fontFamily: SERIF, color: "#A52B1E" }}>
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── My Highlights panel ── */}
      {panelOpen && (
        <>
          <div onClick={() => setPanelOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(51,41,27,0.35)", zIndex: 50 }} />
          <aside style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(380px, 88vw)", background: C.paper,
            borderLeft: `1px solid ${C.panelEdge}`, zIndex: 51, display: "flex", flexDirection: "column", boxShadow: "-8px 0 40px rgba(51,41,27,0.25)" }}>
            <div style={{ padding: "1.1rem 1.25rem", borderBottom: `1px solid ${C.panelEdge}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: HEAD, fontSize: 18, fontWeight: 600, color: C.ink }}>My Highlights</div>
                <div style={{ fontSize: 11, color: C.inkFaint, letterSpacing: "0.04em" }}>
                  {allHighlights == null ? "Loading…" : `${allHighlights.length} verse${allHighlights.length === 1 ? "" : "s"}`}
                </div>
              </div>
              <button onClick={() => setPanelOpen(false)} style={{ ...iconBtn, background: C.panel, color: C.inkSoft, border: `1px solid ${C.panelEdge}` }} aria-label="Close">×</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "0.75rem" }}>
              {allHighlights == null ? (
                <div style={{ textAlign: "center", padding: "3rem 1rem", color: C.inkFaint, fontStyle: "italic" }}>Loading…</div>
              ) : allHighlights.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem 1rem", color: C.inkFaint }}>
                  <div style={{ fontSize: 30, marginBottom: "0.6rem" }}>🖍️</div>
                  <p style={{ fontFamily: HEAD, fontStyle: "italic", fontSize: 16, color: C.inkSoft }}>No highlights yet.</p>
                  <p style={{ fontSize: 13, marginTop: 4 }}>Tap any verse to highlight it.</p>
                </div>
              ) : (
                allHighlights.map((h) => (
                  <button key={h.verseFingerprint}
                    onClick={() => { setPanelOpen(false); navigate(`/etu/${h.book.toLowerCase()}/${h.chapter}/${h.verse}`); }}
                    style={{ width: "100%", textAlign: "left", cursor: "pointer", border: `1px solid ${C.panelEdge}`, background: C.panel,
                      borderRadius: 10, padding: "0.7rem 0.85rem", marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                      background: h.style === "underline" ? "transparent" : h.color,
                      borderBottom: h.style === "underline" ? `4px solid ${h.color}` : undefined,
                      border: h.style === "underline" ? undefined : `1px solid ${C.panelEdge}` }} />
                    <span style={{ fontFamily: SERIF, fontSize: 14, color: C.ink }}>{h.book} {h.chapter}:{h.verse}</span>
                    <span style={{ marginLeft: "auto", fontSize: 10, color: C.inkFaint, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h.style}</span>
                  </button>
                ))
              )}
            </div>
          </aside>
        </>
      )}

      {/* Responsive: hide sidebar toggle on desktop, hide static sidebar on mobile */}
      <style>{`
        .etu-menu { display: none !important; }
        @keyframes etu-bob { 0%,100% { transform: translateY(0); opacity: 0.7; } 50% { transform: translateY(6px); opacity: 1; } }
        @media (max-width: 860px) {
          .etu-menu { display: inline-flex !important; }
          .etu-sidebar { display: none !important; }
          .etu-sidebar[data-open] { display: flex !important; }
          .etu-search { width: 120px !important; }
          .etu-mode { display: none !important; }
          .etu-lang select { max-width: 88px !important; padding-right: 20px !important; }
        }
      `}</style>
    </div>
  );
}

const iconBtn: React.CSSProperties = {
  background: "rgba(246,241,231,0.12)", border: "1px solid rgba(246,241,231,0.2)", color: "#F6F1E7",
  borderRadius: 9, width: 34, height: 34, cursor: "pointer", fontSize: 15, alignItems: "center", justifyContent: "center", display: "inline-flex", flexShrink: 0,
};

function navBtn(disabled: boolean): React.CSSProperties {
  return {
    fontFamily: SERIF, fontSize: 13, cursor: disabled ? "default" : "pointer",
    background: disabled ? "transparent" : C.panel, color: disabled ? C.inkFaint : C.emeraldD,
    border: `1px solid ${disabled ? C.panelEdge : C.gold}`, borderRadius: 20, padding: "8px 18px", opacity: disabled ? 0.5 : 1,
  };
}
