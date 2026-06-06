export type CardType = "feature" | "insight" | "word";

export interface ChronicleEntry {
  id: string;
  type: CardType;
  tag: string;
  date?: string; // MM-DD format for date-specific content
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  sourceUrl?: string;
  hebrew?: string;
  transliteration?: string;
  meaning?: string;
  reference?: string;
}

export const chronicleDatabank: ChronicleEntry[] = [
  // DATE-SPECIFIC
  {
    id: "christmas",
    type: "feature",
    tag: "Occasion",
    date: "12-25",
    title: "The First Christmas",
    subtitle: "December 25th",
    description:
      "The historical context of the Nativity — what Bethlehem looked like under Roman occupation, why a census was called, and what a manger actually was in first-century Judea.",
    sourceUrl: "https://en.wikipedia.org/wiki/Nativity_of_Jesus",
  },
  {
    id: "good-friday",
    type: "feature",
    tag: "Occasion",
    date: "04-18",
    title: "Good Friday",
    subtitle: "The Crucifixion in Historical Context",
    description:
      "Roman crucifixion was a political tool, not just an execution method. Understanding what it meant in the first century changes how you read the Passion narrative entirely.",
    sourceUrl: "https://en.wikipedia.org/wiki/Crucifixion_of_Jesus",
  },
  {
    id: "pentecost",
    type: "feature",
    tag: "Occasion",
    date: "06-08",
    title: "The Day of Pentecost",
    subtitle: "Shavuot — The Hebrew Festival Behind Acts 2",
    description:
      "The disciples weren't just gathered randomly. Shavuot was one of three pilgrimage festivals requiring Jewish men to travel to Jerusalem. The city was packed — which is why 3,000 people heard Peter's sermon.",
    sourceUrl: "https://en.wikipedia.org/wiki/Shavuot",
  },

  // ROTATING — Archaeological
  {
    id: "megiddo",
    type: "insight",
    tag: "Archaeology",
    title: "Megiddo Excavations Reveal New Layer",
    description:
      "Archaeologists at Tel Megiddo uncovered a 10th-century BCE administrative complex that reframes our understanding of early Israelite statehood under the United Monarchy period.",
    sourceUrl: "https://en.wikipedia.org/wiki/Megiddo,_Israel",
  },
  {
    id: "dead-sea-scrolls",
    type: "insight",
    tag: "Archaeology",
    title: "The Dead Sea Scrolls — 75 Years Later",
    description:
      "Discovered in 1947 in the caves of Qumran, the Dead Sea Scrolls pushed back our oldest Hebrew manuscripts by 1,000 years and confirmed the remarkable accuracy of the Masoretic text.",
    sourceUrl: "https://en.wikipedia.org/wiki/Dead_Sea_Scrolls",
  },
  {
    id: "pilate-inscription",
    type: "insight",
    tag: "Archaeology",
    title: "The Pilate Stone",
    description:
      "A limestone block discovered in Caesarea Maritima in 1961 bears the inscription 'Pontius Pilatus, Prefect of Judaea' — the only contemporary archaeological evidence of the man who ordered the crucifixion.",
    sourceUrl: "https://en.wikipedia.org/wiki/Pilate_Stone",
  },

  // ROTATING — Hebrew Words
  {
    id: "shalom",
    type: "word",
    tag: "Hebrew Word",
    hebrew: "שָׁלוֹם",
    transliteration: "Shalom",
    meaning: "Peace / Wholeness / Completeness",
    reference: "Numbers 6:26",
    description:
      "Shalom doesn't just mean the absence of conflict. It means everything being in its right place — wholeness, completeness, nothing missing and nothing broken.",
  },
  {
    id: "hesed",
    type: "word",
    tag: "Hebrew Word",
    hebrew: "חֶסֶד",
    transliteration: "Hesed",
    meaning: "Lovingkindness / Covenant loyalty",
    reference: "Psalm 136",
    description:
      "The most untranslatable word in the Hebrew Bible. It appears 250 times. Every English translation takes a different shot at it: mercy, kindness, steadfast love, loyal love. None fully captures it.",
  },
  {
    id: "emet",
    type: "word",
    tag: "Hebrew Word",
    hebrew: "אֱמֶת",
    transliteration: "Emet",
    meaning: "Truth / Faithfulness / Reliability",
    reference: "Exodus 34:6",
    description:
      "Emet is built from the first, middle, and last letters of the Hebrew alphabet — aleph, mem, tav. The rabbis said: truth spans everything from beginning to end.",
  },

  // ROTATING — Theological Insights
  {
    id: "logos",
    type: "insight",
    tag: "Theology",
    title: "Why John Chose the Word 'Logos'",
    description:
      "When John opens his Gospel with 'In the beginning was the Word (Logos)', he was speaking to two audiences simultaneously — Jews who knew Bereishit, and Greeks who knew Stoic philosophy. Logos was the most loaded word in the ancient world.",
  },
  {
    id: "kingdom-of-god",
    type: "insight",
    tag: "Theology",
    title: "What Did Jesus Mean by 'Kingdom of God'?",
    description:
      "First-century Jews hearing 'Kingdom of God' didn't think of heaven. They thought of Rome being overthrown. Understanding this political charge changes every parable Jesus ever told.",
  },
];

export function getTodayEntries(): ChronicleEntry[] {
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayStr = `${mm}-${dd}`;

  const dateSpecific = chronicleDatabank.filter((e) => e.date === todayStr);
  const rotating = chronicleDatabank.filter((e) => !e.date);

  // Seed rotating entries based on day of year for consistency
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const rotatingPicks = [...rotating]
    .sort((a, b) => a.id.localeCompare(b.id))
    .filter((_, i) => i % Math.ceil(rotating.length / 4) === dayOfYear % Math.ceil(rotating.length / 4))
    .slice(0, 4);

  return [...dateSpecific, ...rotatingPicks];
}