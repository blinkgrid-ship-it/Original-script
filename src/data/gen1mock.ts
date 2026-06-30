// Static mock data for Genesis 1:1 — used while the backend is not yet hosted.
// Matches the VerseData shape returned by GET /api/verse/:book/:chapter/:verse.
import type { VerseData } from "../lib/api";

const gen1v1: VerseData = {
  verseRef: "Gen 1:1",
  book: "Genesis",
  chapter: 1,
  verse: 1,
  osrText: "In the beginning Elohim created the heavens and the earth.",
  hebrewText: "בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ",
  transliteration: "Bereshit bara Elohim et hashamayim ve-et ha-aretz",
  ndh: { code: "P", confidence: "consensus" },
  jars: {
    word_study: {
      words: [
        {
          hebrew: "בְּרֵאשִׁית",
          transliteration: "bereshit",
          meaning: "In the beginning / in a beginning",
          note: 'From rosh — "head." Not "the beginning of time" but "at the head of." The Priestly writer opens not with a date but a doorway.',
        },
        {
          hebrew: "בָּרָא",
          transliteration: "bara",
          meaning: "created — used only of God",
          note: "Never used of human making. Effortless creation by word alone — the opposite of the Babylonian gods who built the world from a slain corpse.",
        },
        {
          hebrew: "אֱלֹהִים",
          transliteration: "Elohim",
          meaning: "God (plural form, singular in force)",
          note: "The Priestly source uses Elohim exclusively — never YHWH — until Exodus 6. A deliberate, transcendent name for a God above the chaos.",
        },
        {
          hebrew: "הַשָּׁמַיִם וְהָאָרֶץ",
          transliteration: "hashamayim ve-ha-aretz",
          meaning: "the heavens and the earth",
          note: 'A merism — naming the two opposite poles to mean "absolutely everything." Hebrew says "all of it" by naming its edges.',
        },
      ],
    },
    event_timeline: {
      event_period: "Before time — the claimed moment of creation",
      event_world:
        "No world yet. The verse describes the instant before instants — only Elohim and the act of making.",
      god_concept_then:
        "A single sovereign Creator who speaks reality into being — ordered, intentional, alone.",
    },
    writing_timeline: {
      writing_period: "~550 BCE — the Babylonian exile",
      ndh_source_full: "P — the Priestly source",
      writing_location:
        "Babylon — by the rivers of a foreign empire, the Temple in ruins 900 km away.",
      writing_context:
        "Judah is conquered, the Temple is ash, and the exiles live under a Babylonian priesthood whose New Year festival recites the Enuma Elish — a creation by violence, the world built from the corpse of the chaos-goddess Tiamat.",
      writers_god_concept:
        "Against that, the Priestly writer answers with breathtaking calm: no war, no corpse, no rival gods. One God who simply speaks. Their God did not lose the war — there was never a war. He was ordering.",
      unspoken_motive:
        "To give a defeated, displaced people a God bigger than the empire that crushed them. Genesis 1 is resistance literature wearing the robes of liturgy.",
    },
    social_event: {
      social_structure: "None — the verse predates society.",
      political_context:
        "The claim itself is political: if one God made the heavens and the earth, then no emperor owns them.",
    },
    social_writing: {
      audience: "Exiled Judeans tempted to believe their God had been defeated by Babylon's.",
      political_purpose:
        "To deny Babylon's gods any role in creation — a quiet act of defiance sung as worship.",
      theological_purpose:
        "To establish a single, good, ordering God as the ground of everything, before a single law is given.",
    },
    science: {
      alignment_score: 6,
      ancient_cosmology:
        "A flat earth under a solid dome (raqia) holding back the waters above — the standard cosmology of the ancient Near East. The verse is not describing the Big Bang.",
      honest_bridge:
        "Read as physics it is of its age. Read as a claim about meaning — that existence is intended, not accidental — it asks a question science does not answer and never claimed to.",
    },
    theology: {
      god_concept:
        "Elohim as orderer of chaos — transcendent, sovereign, and not yet revealed as love.",
      film_projector_flag: false,
      film_assessment:
        "A good but distant God — a cosmic architect. The warmth of \"God is love\" that Yeshua reveals is not here yet: this is the first frame of a long film, not the final one.",
      prevailing_verse_ref: "John 1:1",
      prevailing_verse_text:
        "In the beginning was the Word, and the Word was with God, and the Word was God.",
      prevailing_note:
        "John deliberately echoes Genesis 1:1 — \"in the beginning\" — and reframes the impersonal creating word as a Person. The arc from Elohim-who-orders to the Word-who-loves begins right here.",
    },
    osr_commentary: {
      cinematic_scene:
        "It is night in Babylon, and the priest cannot sleep.\n\nOutside, the ziggurat of Marduk still glows with the last of the festival fires. For eleven days the city has chanted the Enuma Elish — how the warrior-god split the chaos-goddess Tiamat like a shellfish and built the sky from her ribs. The Judean exile has heard it every year. He has watched his own children learn the tune.\n\nHe sits with a reed pen and does not argue. He does not write \"your gods are false.\" He writes something quieter and far more dangerous.\n\n\"In the beginning, Elohim created the heavens and the earth.\"\n\nNo battle. No corpse. No second god to fight. One God, and a world that comes not from violence but from a word. The chaos the Babylonians fear is, in his telling, not an enemy — only material, waiting. His God did not win the war. There was never a war. He was simply, always, in charge.\n\nIt is the calmest sentence ever written in a refugee camp. And it will outlive the empire that made him a refugee.",
      scholars_conclusion:
        "Measured honestly, Genesis 1:1 is not a science textbook and was never meant to be one. It is a theological counter-strike — composed in exile, aimed at Babylon, written to tell a broken people that their God was never defeated, because He was never merely one god among many.\n\nIt gives us a Creator who is sovereign, intentional, and good. But notice what it does not yet give us: warmth. This Elohim orders; He does not yet embrace. The God revealed as love — whom Yeshua will call Father — is the destination of the whole book, not its first verse.\n\nSo we hold it honestly: a magnificent opening, a God big enough to survive an empire — and a door left open toward something the exiles could not yet see.",
    },
  },
};

export default gen1v1;
