import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchVerse, type VerseData } from "../lib/api";
import { useTheme } from "../context/ThemeContext";

// ── NDH source metadata (Documentary Hypothesis) ────────────────────────────────
const NDH: Record<string, { name: string; era: string; colour: string }> = {
  P: { name: "Priestly Source", era: "~538–450 BCE · Babylonian exile", colour: "#0d6e76" },
  J: { name: "Yahwist Source", era: "~950–850 BCE · Judah", colour: "#BA7517" },
  E: { name: "Elohist Source", era: "~850–750 BCE · Northern Israel", colour: "#378ADD" },
  D: { name: "Deuteronomist", era: "~621 BCE · Jerusalem", colour: "#534AB7" },
  R: { name: "Redactor", era: "~400 BCE · the final editor", colour: "#8B5F2B" },
};
function ndhMeta(code: string | null) {
  if (!code) return null;
  return NDH[code] ?? { name: code, era: "mixed source", colour: "#8B5F2B" };
}

// ── Divine-name colouring (the heart of the OSR translation) ────────────────────
function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
// SAFE — only use with OSR database content, never user input.
function colourDivineNames(text: string): string {
  let t = escapeHtml(text);
  t = t.replace(/יהוה/g, '<span style="color:#EF9F27">יהוה</span>');
  t = t.replace(/\bElohim\b/g, '<span style="color:#AFA9EC">Elohim</span>');
  t = t.replace(/\bYeshua\b/g, '<span style="color:#1D9E75">Yeshua</span>');
  t = t.replace(/\bRuach\b/g, '<span style="color:#9985c4">Ruach</span>');
  return t;
}
function DivineText({ text, style }: { text: string; style?: React.CSSProperties }) {
  return <span style={style} dangerouslySetInnerHTML={{ __html: colourDivineNames(text) }} />;
}

// ── small presentational helpers ────────────────────────────────────────────────
const card: React.CSSProperties = { borderRadius: 14, padding: "1.75rem", marginBottom: "1rem" };
const jarLabel: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.9rem",
};

function Paragraphs({ text, color }: { text: string; color: string }) {
  return (
    <>
      {text.split("\n\n").map((p, i) => (
        <p key={i} style={{ fontFamily: "Georgia, serif", fontSize: 17, lineHeight: 1.85, color, marginBottom: "1rem" }}>
          <DivineText text={p} />
        </p>
      ))}
    </>
  );
}

// ── Theme-aware palette for the two card "moods" this page alternates between:
// cosmic (cinematic scene, theology, timelines, science) and parchment (scholar's
// conclusion, word study). Both moods exist in either app theme — only their exact
// tones shift, so the page always tracks the light/dark toggle instead of being
// permanently pinned to the dark "night sky" look.
function useDeepReadPalette() {
  const { theme } = useTheme();
  const isDark = theme !== "light";
  return {
    isDark,
    pageBg: "rgb(var(--color-ink))",
    pageText: "rgb(var(--color-parchment))",
    heroGradient: isDark
      ? "radial-gradient(circle at 30% 20%, #160d2e, #07040f 70%)"
      : "radial-gradient(circle at 30% 20%, #efe6d6, #e7dfce 70%)",
    backLink: isDark ? "#9985c4" : "#6b4fa0",
    cosmicCard: isDark
      ? { background: "#0f0b1e", border: "1px solid rgba(83,74,183,0.25)" }
      : { background: "#f2eef8", border: "1px solid rgba(83,74,183,0.25)" },
    cosmicLabel: isDark ? "#9985c4" : "#6b4fa0",
    cosmicText: isDark ? "#ddd5f0" : "#3d3560",
    cosmicTextDim: isDark ? "#b6abd6" : "#5c4f80",
    creamCard: isDark
      ? { background: "#fffef9", border: "1px solid #e0d8c8" }
      : { background: "#fffef9", border: "1px solid #c9bfa8" },
    creamLabel: "#888",
    creamText: "#1a1209",
    creamTextDim: "#3a3020",
    nightCard: isDark
      ? { background: "#141019", border: "1px solid #2a2336" }
      : { background: "#f5f2fa", border: "1px solid #ddd4ec" },
    detailLabel: isDark ? "#7a7088" : "#8a7fa0",
    detailText: isDark ? "#cfc7dc" : "#453a5c",
    navDim: isDark ? "#3a3450" : "#c9c0da",
    navDimBorder: isDark ? "#221c33" : "#e0d9ec",
  };
}

export default function VerseReaderPage() {
  const { book = "genesis", chapter = "1", verse = "1" } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<VerseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pal = useDeepReadPalette();

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchVerse(book, chapter, verse)
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Verse not found."))
      .finally(() => setLoading(false));
  }, [book, chapter, verse]);

  if (loading) {
    return <div style={{ minHeight: "100vh", background: pal.pageBg, color: pal.backLink, display: "flex", alignItems: "center", justifyContent: "center" }}>Loading verse…</div>;
  }
  if (error || !data) {
    return (
      <div style={{ minHeight: "100vh", background: pal.pageBg, color: pal.backLink, display: "flex", flexDirection: "column", gap: 16, alignItems: "center", justifyContent: "center" }}>
        <p>{error ?? "Verse not found."}</p>
        <button onClick={() => navigate("/codex")} style={{ color: "#C9A84C", background: "none", border: "1px solid rgba(201,168,76,0.4)", borderRadius: 20, padding: "6px 16px", cursor: "pointer" }}>← Back to Codex</button>
      </div>
    );
  }

  const src = ndhMeta(data.ndh.code);
  const j = data.jars;
  const vNum = data.verse;

  return (
    <div style={{ minHeight: "100vh", background: pal.pageBg, color: pal.pageText, paddingBottom: "4rem" }}>
      {/* Hero — night sky (dark) / soft daylight (light) */}
      <div style={{ background: pal.heroGradient, padding: "2.5rem 1.25rem 3rem" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <button onClick={() => navigate("/codex")} style={{ color: pal.backLink, background: "none", border: "none", cursor: "pointer", fontSize: 12, marginBottom: "1.5rem" }}>← Codex</button>

          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "1rem" }}>
            {data.book} · Chapter {data.chapter} · Verse {vNum}
          </div>

          {/* NDH source tag */}
          {src && (
            <div style={{ display: "inline-block", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "5px 14px", borderRadius: 20, marginBottom: "1.5rem", background: `${src.colour}26`, color: src.colour, border: `1px solid ${src.colour}80` }}>
              {data.ndh.code} · {src.name} · {src.era}
              {data.ndh.confidence && data.ndh.confidence !== "consensus" ? ` · ${data.ndh.confidence}` : ""}
            </div>
          )}

          {/* OSR verse line */}
          <p style={{ fontFamily: "Georgia, serif", fontSize: "1.6rem", lineHeight: 1.9, color: pal.pageText, borderLeft: `2px solid ${src?.colour ?? "#C9A84C"}`, paddingLeft: "1.1rem" }}>
            <DivineText text={data.osrText} />
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "1.5rem 1.25rem 0" }}>

        {/* OSR Commentary — cinematic scene + scholar's conclusion */}
        {j.osr_commentary && (
          <>
            <div style={{ ...card, ...pal.cosmicCard }}>
              <div style={{ ...jarLabel, color: pal.cosmicLabel }}>✦ Cinematic Scene</div>
              <Paragraphs text={j.osr_commentary.cinematic_scene} color={pal.cosmicText} />
            </div>
            <div style={{ ...card, ...pal.creamCard }}>
              <div style={{ ...jarLabel, color: pal.creamLabel }}>Scholar’s Conclusion</div>
              {j.osr_commentary.scholars_conclusion.split("\n\n").map((p: string, i: number) => (
                <p key={i} style={{ fontFamily: "Georgia, serif", fontSize: 17, fontStyle: "italic", lineHeight: 1.85, color: pal.creamText, marginBottom: "1rem" }}>
                  <DivineText text={p} />
                </p>
              ))}
            </div>
          </>
        )}

        {/* Theology — prevailing verse */}
        {j.theology && (
          <div style={{ ...card, ...pal.cosmicCard }}>
            <div style={{ ...jarLabel, color: pal.cosmicLabel }}>Theology — God-concept vs. Yeshua’s standard</div>
            <p style={{ fontSize: 15.5, lineHeight: 1.8, color: pal.cosmicText, marginBottom: "0.75rem" }}>{j.theology.god_concept}</p>
            <p style={{ fontSize: 14.5, lineHeight: 1.8, color: pal.cosmicTextDim, marginBottom: "1.25rem" }}>{j.theology.film_assessment}</p>
            {j.theology.prevailing_verse_ref && (
              <div style={{ background: "#051409", borderRadius: 12, padding: "1.25rem", border: "1px solid rgba(29,158,117,0.35)" }}>
                <div style={{ ...jarLabel, color: "#1D9E75" }}>The prevailing word — {j.theology.prevailing_verse_ref}</div>
                <p style={{ fontFamily: "Georgia, serif", fontSize: 16, fontStyle: "italic", color: "#b8e0d0", lineHeight: 1.85, marginBottom: "0.5rem" }}>
                  <DivineText text={`"${j.theology.prevailing_verse_text}"`} />
                </p>
                <p style={{ fontSize: 13.5, color: "#7fb39c", lineHeight: 1.7 }}>{j.theology.prevailing_note}</p>
              </div>
            )}
          </div>
        )}

        {/* Word study */}
        {j.word_study?.words?.length > 0 && (
          <div style={{ ...card, ...pal.creamCard }}>
            <div style={{ ...jarLabel, color: pal.creamLabel }}>Word Study</div>
            {j.word_study.words.map((w: any, i: number) => (
              <div key={i} style={{ display: "flex", gap: "1rem", padding: "0.75rem 0", borderBottom: i < j.word_study.words.length - 1 ? "1px solid #efe9dc" : "none" }}>
                <div style={{ minWidth: 64, fontFamily: "Georgia, serif", fontSize: "1.5rem", color: "#534AB7", direction: "rtl", textAlign: "right" }}>{w.hebrew}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11.5, fontStyle: "italic", color: pal.creamLabel }}>{w.transliteration}</div>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: pal.creamText, marginBottom: 4 }}>{w.meaning}</div>
                  <div style={{ fontSize: 13.5, lineHeight: 1.7, color: pal.creamTextDim }}>{w.note}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Writing timeline */}
        {j.writing_timeline && (
          <div style={{ ...card, ...pal.nightCard }}>
            <div style={{ ...jarLabel, color: "#C9A84C" }}>When &amp; why it was written</div>
            <Detail k="Period" v={j.writing_timeline.writing_period} />
            <Detail k="Source" v={j.writing_timeline.ndh_source_full} />
            <Detail k="Where" v={j.writing_timeline.writing_location} />
            <Detail k="Context" v={j.writing_timeline.writing_context} />
            <Detail k="The writer’s God" v={j.writing_timeline.writers_god_concept} />
            <Detail k="Unspoken motive" v={j.writing_timeline.unspoken_motive} accent />
          </div>
        )}

        {/* Event timeline */}
        {j.event_timeline && (
          <div style={{ ...card, ...pal.nightCard }}>
            <div style={{ ...jarLabel, color: "#C9A84C" }}>When the events happened</div>
            <Detail k="Period" v={j.event_timeline.event_period} />
            <Detail k="World" v={j.event_timeline.event_world} />
            <Detail k="God-concept then" v={j.event_timeline.god_concept_then} />
          </div>
        )}

        {/* Science */}
        {j.science && (
          <div style={{ ...card, ...pal.nightCard }}>
            <div style={{ ...jarLabel, color: "#378ADD" }}>Science layer{typeof j.science.alignment_score === "number" ? ` · alignment ${j.science.alignment_score}/10` : ""}</div>
            <Detail k="Ancient cosmology" v={j.science.ancient_cosmology} />
            <Detail k="Honest bridge" v={j.science.honest_bridge} />
          </div>
        )}

        {/* No jars yet */}
        {Object.keys(j).length === 0 && (
          <div style={{ ...card, ...pal.cosmicCard, borderStyle: "dashed", textAlign: "center" }}>
            <p style={{ color: pal.cosmicLabel, fontSize: 15 }}>Deep commentary for this verse is coming soon.</p>
            <p style={{ color: pal.cosmicTextDim, fontSize: 13, marginTop: 6 }}>(Sample commentary is currently authored for Genesis 1:1.)</p>
          </div>
        )}

        {/* Verse navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
          <button disabled={vNum <= 1} onClick={() => navigate(`/codex/${book}/${chapter}/${vNum - 1}`)} style={navBtn(vNum <= 1, pal)}>← Verse {vNum - 1}</button>
          <button onClick={() => navigate(`/codex/${book}/${chapter}/${vNum + 1}`)} style={navBtn(false, pal)}>Verse {vNum + 1} →</button>
        </div>
      </div>
    </div>
  );
}

function Detail({ k, v, accent }: { k: string; v?: string; accent?: boolean }) {
  const pal = useDeepReadPalette();
  if (!v) return null;
  return (
    <div style={{ marginBottom: "0.85rem" }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: accent ? "#C9A84C" : pal.detailLabel, marginBottom: 3 }}>{k}</div>
      <div style={{ fontSize: 15, lineHeight: 1.75, color: accent ? "#e7d6a8" : pal.detailText }}>{v}</div>
    </div>
  );
}

function navBtn(disabled: boolean, pal: ReturnType<typeof useDeepReadPalette>): React.CSSProperties {
  return {
    fontSize: 12, color: disabled ? pal.navDim : pal.backLink, background: "none",
    border: `1px solid ${disabled ? pal.navDimBorder : "rgba(153,133,196,0.4)"}`, borderRadius: 20,
    padding: "6px 14px", cursor: disabled ? "default" : "pointer",
  };
}
