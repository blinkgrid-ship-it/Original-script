// Shared palette + bits for the admin portal — same parchment/emerald/gold family as the
// ETU reader so the two "institutional" surfaces feel like one product.
export const A = {
  paper:     "#F6F1E7", // content background
  panel:     "#EFE7D6", // cards
  panelEdge: "#E1D6BF",
  ink:       "#33291B",
  inkSoft:   "#6B5E48",
  inkFaint:  "#9A8B70",
  emerald:   "#1D6B5F",
  emeraldD:  "#155049", // sidebar
  emeraldDD: "#0E3B36", // sidebar hover
  gold:      "#B08948",
  goldSoft:  "#D8C7A0",
  cream:     "#F6F1E7",
  danger:    "#A04B3A",
};

export const SERIF = "'Lora', Georgia, 'Times New Roman', serif";
export const HEAD = "'Playfair Display', Georgia, serif";

// 66-book canon (name + chapter count) for dropdowns.
export const BOOKS: { name: string; chapters: number }[] = [
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

// ── Shared style snippets ─────────────────────────────────────────────────────
import type React from "react";

export const card: React.CSSProperties = {
  background: "#FFFDF8",
  border: `1px solid ${A.panelEdge}`,
  borderRadius: 14,
  padding: "1.25rem 1.4rem",
};

export const label: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: A.inkFaint,
  marginBottom: 6,
  fontFamily: SERIF,
};

export const input: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: 9,
  border: `1px solid ${A.panelEdge}`,
  background: "#FFFDF8",
  color: A.ink,
  fontSize: 14,
  fontFamily: SERIF,
};

export function btn(variant: "primary" | "ghost" | "danger" = "primary"): React.CSSProperties {
  const base: React.CSSProperties = {
    cursor: "pointer",
    borderRadius: 10,
    padding: "13px 18px",
    fontSize: 13,
    fontWeight: 600,
    fontFamily: SERIF,
    letterSpacing: "0.03em",
    transition: "transform 0.12s ease, opacity 0.12s ease",
  };
  if (variant === "primary") return { ...base, background: A.emerald, color: A.cream, border: `1px solid ${A.emeraldD}` };
  if (variant === "danger") return { ...base, background: "transparent", color: A.danger, border: `1px solid ${A.danger}55` };
  return { ...base, background: "transparent", color: A.emeraldD, border: `1px solid ${A.gold}88` };
}
