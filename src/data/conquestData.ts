export interface ConquestWord {
  id: string;
  hebrew: string;
  transliteration: string;
  root: string;
  primaryMeaning: string;
  secondaryMeaning: string;
  genesisContext: string;
  bibleUsages: { reference: string; text: string }[];
  memoryAid: string;
  xp: number;
}

export interface ConquestChapter {
  chapterNumber: number;
  title: string;
  words: ConquestWord[];
}

export const conquestChapters: ConquestChapter[] = [
  {
    chapterNumber: 1,
    title: "The Creation",
    words: [
      {
        id: "bereishit",
        hebrew: "בְּרֵאשִׁית",
        transliteration: "Bereishit",
        root: "ראש — Rosh (head)",
        primaryMeaning: "In the beginning",
        secondaryMeaning: "At the head of / First in sequence",
        genesisContext: "The very first word of the entire Torah — Genesis 1:1",
        bibleUsages: [
          { reference: "Genesis 1:1", text: "In the beginning, God created the heavens and the earth." },
          { reference: "John 1:1", text: "In the beginning was the Word — the Greek echoes bereishit deliberately." },
          { reference: "Proverbs 8:23", text: "I was appointed from eternity, from the beginning..." },
        ],
        memoryAid: "Rosh Hashanah — the Jewish New Year — uses the same root. Rosh = head. Bereishit = at the head of time.",
        xp: 50,
      },
      {
        id: "bara",
        hebrew: "בָּרָא",
        transliteration: "Bara",
        root: "ברא",
        primaryMeaning: "Created (from nothing)",
        secondaryMeaning: "To bring into existence — exclusively divine act",
        genesisContext: "Genesis 1:1 — God bara'd the heavens and the earth.",
        bibleUsages: [
          { reference: "Genesis 1:1", text: "In the beginning God created (bara) the heavens and the earth." },
          { reference: "Isaiah 45:18", text: "He who created (bara) the heavens, he is God." },
          { reference: "Psalm 51:10", text: "Create (bara) in me a clean heart, O God." },
        ],
        memoryAid: "Only God is ever the subject of bara in the entire Bible. Humans make or form — only God bara's.",
        xp: 50,
      },
      {
        id: "elohim",
        hebrew: "אֱלֹהִים",
        transliteration: "Elohim",
        root: "אל — El (strength, power)",
        primaryMeaning: "God",
        secondaryMeaning: "Plural of majesty — fullness of divine power",
        genesisContext: "Genesis 1:1 — Elohim created. Plural noun, singular verb.",
        bibleUsages: [
          { reference: "Genesis 1:1", text: "Elohim created — plural noun, singular verb, intentional tension." },
          { reference: "Psalm 82:1", text: "God presides in the great assembly; he renders judgment among the gods." },
          { reference: "Exodus 20:3", text: "You shall have no other elohim before me." },
        ],
        memoryAid: "El = power. Elohim = the fullness of all power. The plural isn't polytheism — it's the Hebrew way of saying ultimate, complete, beyond category.",
        xp: 60,
      },
      {
        id: "tohu-vavohu",
        hebrew: "תֹהוּ וָבֹהוּ",
        transliteration: "Tohu vaVohu",
        root: "תהו / בהו",
        primaryMeaning: "Formless and void",
        secondaryMeaning: "Primordial chaos / unformed potential",
        genesisContext: "Genesis 1:2 — the state of the earth before God began ordering creation.",
        bibleUsages: [
          { reference: "Genesis 1:2", text: "The earth was tohu vavohu — formless and empty." },
          { reference: "Jeremiah 4:23", text: "I looked at the earth — it was tohu vavohu. A vision of judgment reversing creation." },
          { reference: "Isaiah 34:11", text: "God will stretch over it the measuring line of tohu — chaos as judgment." },
        ],
        memoryAid: "It's a rhyming pair — like saying 'helter-skelter'. The sound itself feels chaotic. Tohu vaVohu = the universe's messy starting point.",
        xp: 70,
      },
      {
        id: "ruach",
        hebrew: "רוּחַ",
        transliteration: "Ruach",
        root: "רוח",
        primaryMeaning: "Spirit / Wind / Breath",
        secondaryMeaning: "The animating force of life — divine and human",
        genesisContext: "Genesis 1:2 — Ruach Elohim hovered over the waters.",
        bibleUsages: [
          { reference: "Genesis 1:2", text: "The Ruach of God was hovering over the waters." },
          { reference: "Genesis 2:7", text: "God breathed (ruach) into his nostrils the breath of life." },
          { reference: "Ezekiel 37:9", text: "Come from the four winds (ruach), O breath (ruach), and breathe into these slain." },
        ],
        memoryAid: "Ruach is the word that connects God's Spirit, the wind in the trees, and the breath in your lungs. All three are the same Hebrew word.",
        xp: 60,
      },
    ],
  },
  {
    chapterNumber: 2,
    title: "The Sabbath",
    words: [
      {
        id: "vaykhulu",
        hebrew: "וַיְכֻלּוּ",
        transliteration: "Vaykhulu",
        root: "כלה (kalah)",
        primaryMeaning: "Were completed / finished",
        secondaryMeaning: "Brought to wholeness",
        genesisContext: "Genesis 2:1 — the heavens and earth were completed.",
        bibleUsages: [
          { reference: "Genesis 2:1", text: "Thus the heavens and earth were completed (vaykhulu) in all their vast array." },
          { reference: "1 Kings 6:38", text: "The temple was finished (kalah) in all its details." },
          { reference: "Psalm 72:20", text: "The prayers of David son of Jesse are ended (kalah)." },
        ],
        memoryAid: "Vaykhulu opens the Shabbat kiddush every Friday night. When you hear it at a Jewish dinner table, you're hearing Genesis 2:1 recited.",
        xp: 50,
      },
      {
        id: "vayishbot",
        hebrew: "וַיִּשְׁבֹּת",
        transliteration: "Vayishbot",
        root: "שבת (shavat)",
        primaryMeaning: "And he rested / ceased",
        secondaryMeaning: "Intentional stopping — not exhaustion",
        genesisContext: "Genesis 2:2 — God rested on the seventh day.",
        bibleUsages: [
          { reference: "Genesis 2:2", text: "On the seventh day God rested (vayishbot) from all his work." },
          { reference: "Exodus 20:11", text: "For in six days the LORD made the heavens and earth, and on the seventh day he rested (shavat)." },
          { reference: "Exodus 31:17", text: "He rested (shavat) and was refreshed." },
        ],
        memoryAid: "Shabbat, Sabbath, Sabado (Spanish for Saturday) — all from this root. The day of intentional rest is named after this single divine act in Genesis 2.",
        xp: 60,
      },
      {
        id: "vayekadesh",
        hebrew: "וַיְקַדֵּשׁ",
        transliteration: "Vayekadesh",
        root: "קדש (kadash)",
        primaryMeaning: "Made holy / sanctified",
        secondaryMeaning: "Set apart for divine purpose",
        genesisContext: "Genesis 2:3 — God sanctified the seventh day.",
        bibleUsages: [
          { reference: "Genesis 2:3", text: "God blessed the seventh day and made it holy (vayekadesh)." },
          { reference: "Exodus 19:23", text: "Set bounds around the mountain and consecrate (kadash) it." },
          { reference: "Isaiah 6:3", text: "Holy (kadosh), holy, holy is the LORD Almighty." },
        ],
        memoryAid: "Kiddush (Friday night blessing over wine), Kadosh (holy), Kedushah (holiness prayer) — all from kadash. The first holy thing in the Bible is time, not a place.",
        xp: 70,
      },
    ],
  },
  {
    chapterNumber: 3,
    title: "The Serpent & The Fall",
    words: [
      {
        id: "nachash",
        hebrew: "הַנָּחָשׁ",
        transliteration: "HaNachash",
        root: "נחש (nachash)",
        primaryMeaning: "The serpent",
        secondaryMeaning: "To practice divination / to observe omens",
        genesisContext: "Genesis 3:1 — the most crafty of all creatures.",
        bibleUsages: [
          { reference: "Genesis 3:1", text: "Now the serpent (nachash) was more crafty than any wild animal." },
          { reference: "Numbers 21:9", text: "Moses made a bronze serpent (nachash) and put it on a pole." },
          { reference: "Isaiah 27:1", text: "The LORD will punish Leviathan, the gliding serpent (nachash)." },
        ],
        memoryAid: "Nachash shares its root with the word for divination — the serpent represents forbidden knowledge from the very start of scripture.",
        xp: 60,
      },
      {
        id: "arum",
        hebrew: "עָרוּם",
        transliteration: "Arum",
        root: "ערם (aram)",
        primaryMeaning: "Crafty / shrewd / subtle",
        secondaryMeaning: "Prudent / wise (positive usage in Proverbs)",
        genesisContext: "Genesis 3:1 — the serpent was arum, more than any beast.",
        bibleUsages: [
          { reference: "Genesis 3:1", text: "The serpent was more crafty (arum) than any wild animal." },
          { reference: "Proverbs 12:16", text: "A prudent (arum) man overlooks an insult." },
          { reference: "Proverbs 14:8", text: "The wisdom of the prudent (arum) is to give thought to their ways." },
        ],
        memoryAid: "Same word, opposite contexts. In Genesis 3, arum is the serpent's dangerous cunning. In Proverbs, it's admirable wisdom. The quality itself is neutral — its use determines its morality.",
        xp: 60,
      },
      {
        id: "tov-vara",
        hebrew: "טוֹב וָרָע",
        transliteration: "Tov vaRa",
        root: "טוב / רע",
        primaryMeaning: "Good and evil",
        secondaryMeaning: "All things / total knowledge (merism)",
        genesisContext: "Genesis 3:5 — knowing good and evil means knowing everything.",
        bibleUsages: [
          { reference: "Genesis 3:5", text: "You will be like God, knowing good (tov) and evil (ra)." },
          { reference: "Genesis 3:22", text: "The man has become like one of us, knowing good and evil." },
          { reference: "2 Samuel 14:17", text: "My lord the king is like an angel of God in discerning good and evil." },
        ],
        memoryAid: "In Hebrew, 'from A to Z' is expressed as 'from aleph to tav.' Similarly, 'good and evil' is a merism — it means the full range of all knowledge, not just moral categories.",
        xp: 70,
      },
    ],
  },
];

// Helper to get words for a specific chapter
export function getChapterWords(chapterNumber: number) {
  return conquestChapters.find((c) => c.chapterNumber === chapterNumber) ?? conquestChapters[0];
}

// Keep backward compatibility
export const chapter1Words = conquestChapters[0].words;