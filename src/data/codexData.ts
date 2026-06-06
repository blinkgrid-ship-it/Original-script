export interface HebrewWord {
  word: string;
  transliteration: string;
  root: string;
  meaning: string;
  usage: string;
}

export interface Verse {
  number: number;
  english: string;
  malayalam: string;
  hebrew: string;
  hebrewWords: HebrewWord[];
  explanation: string;
  realLifeExample: string;
}

export interface Chapter {
  number: number;
  verses: Verse[];
}

export const genesis: Chapter[] = [
  {
    number: 1,
    verses: [
      {
        number: 1,
        english: "In the beginning, God created the heavens and the earth.",
        malayalam: "ആദിയിൽ ദൈവം ആകാശവും ഭൂമിയും സൃഷ്ടിച്ചു.",
        hebrew: "בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ",
        hebrewWords: [
          {
            word: "בְּרֵאשִׁית",
            transliteration: "Bereishit",
            root: "ראש (rosh)",
            meaning: "In the beginning",
            usage: "The very first word of the Torah. Rosh means 'head' — this is the head of all things.",
          },
          {
            word: "בָּרָא",
            transliteration: "Bara",
            root: "ברא",
            meaning: "Created (ex nihilo)",
            usage: "This verb is used exclusively with God as subject — only God creates from nothing.",
          },
          {
            word: "אֱלֹהִים",
            transliteration: "Elohim",
            root: "אל (El)",
            meaning: "God (plural form)",
            usage: "Plural noun used with singular verb — a grammatical tension ancient rabbis debated for centuries.",
          },
          {
            word: "הַשָּׁמַיִם",
            transliteration: "HaShamayim",
            root: "שמים",
            meaning: "The heavens",
            usage: "Always plural in Hebrew. Some scholars see 'sham' (there) + 'mayim' (water) — water that is there.",
          },
          {
            word: "הָאָרֶץ",
            transliteration: "HaAretz",
            root: "ארץ",
            meaning: "The earth / the land",
            usage: "Can mean the whole earth or a specific land. Context determines which — a key interpretive tension throughout Genesis.",
          },
        ],
        explanation:
          "Genesis 1:1 is not a scientific statement — it is a theological one. The ancient Near East was full of creation myths where gods fought chaos monsters to create the world. Genesis subverts all of them: there is no battle, no competing deity, no struggle. God speaks, and it is. The Hebrew word 'bara' is used exclusively with God as the subject throughout the entire Hebrew Bible. The plural 'Elohim' with a singular verb has fascinated scholars for millennia — it is a grammatical form called 'majestic plural' used to express the fullness of divine being.",
        realLifeExample:
          "Think of the difference between an architect who works with existing materials and a composer who creates a melody from silence. Bara is the composer. Every human act of creation rearranges existing things. Genesis 1:1 claims something happened that has never happened since: something from absolute nothing.",
      },
      {
        number: 2,
        english:
          "The earth was without form and void, and darkness was over the face of the deep. And the Spirit of God was hovering over the face of the waters.",
        malayalam:
          "ഭൂമി പാഴും ശൂന്യവുമായിരുന്നു; ആഴത്തിന്റെ മുഖത്തു അന്ധകാരം ഉണ്ടായിരുന്നു; ദൈവത്തിന്റെ ആത്മാവ് വെള്ളത്തിന്റെ മുഖത്തു വിരിഞ്ഞുകൊണ്ടിരുന്നു.",
        hebrew:
          "וְהָאָרֶץ הָיְתָה תֹהוּ וָבֹהוּ וְחֹשֶׁךְ עַל־פְּנֵי תְהוֹם וְרוּחַ אֱלֹהִים מְרַחֶפֶת עַל־פְּנֵי הַמָּיִם",
        hebrewWords: [
          {
            word: "תֹהוּ וָבֹהוּ",
            transliteration: "Tohu vaVohu",
            root: "תהו / בהו",
            meaning: "Formless and void",
            usage: "A Hebrew rhyming pair describing primordial chaos. Used only 3 times in the entire Bible.",
          },
          {
            word: "רוּחַ",
            transliteration: "Ruach",
            root: "רוח",
            meaning: "Spirit / wind / breath",
            usage: "The same word means all three. Ancient interpreters disagreed — and still do.",
          },
          {
            word: "מְרַחֶפֶת",
            transliteration: "Merachefet",
            root: "רחף",
            meaning: "Hovering / brooding",
            usage: "Used only one other time — in Deuteronomy 32:11, describing an eagle hovering over its nest. Protective. Maternal.",
          },
        ],
        explanation:
          "Tohu vaVohu — the earth was chaos. This is not evil; it is unformed potential. The Ruach Elohim hovers over the waters. The Hebrew verb 'merachefet' appears only one other time in the entire Bible: in Deuteronomy 32:11, where it describes an eagle hovering protectively over its young.",
        realLifeExample:
          "Before a sculptor begins, the marble block is tohu vaVohu — full of potential but formless. The artist hovers over it, seeing what it can become, then begins the work of bringing order out of raw material.",
      },
      {
        number: 3,
        english: "And God said, 'Let there be light,' and there was light.",
        malayalam: "ദൈവം വെളിച്ചം ഉണ്ടാകട്ടെ എന്നു കല്പിച്ചു; വെളിച്ചം ഉണ്ടായി.",
        hebrew: "וַיֹּאמֶר אֱלֹהִים יְהִי אוֹר וַיְהִי אוֹר",
        hebrewWords: [
          {
            word: "וַיֹּאמֶר",
            transliteration: "Vayomer",
            root: "אמר (amar)",
            meaning: "And he said",
            usage: "God creates by speaking. This is the first divine speech act in the Bible — and it produces reality.",
          },
          {
            word: "יְהִי אוֹר",
            transliteration: "Yehi Or",
            root: "היה / אור",
            meaning: "Let there be light",
            usage: "Yehi is jussive form — a command that expresses will. Or means light. Three Hebrew words that changed everything.",
          },
        ],
        explanation:
          "God speaks and reality responds. This pattern — God said, and it was — repeats eight times in Genesis 1. Ancient Near Eastern creation myths involved physical struggle. Genesis replaces all of that with a word. The theological implication is enormous: the universe is not a battlefield. It is a speech act.",
        realLifeExample:
          "When a judge says 'not guilty,' the words don't describe reality — they create it. The person's legal status changes the moment the words are spoken. Genesis 1:3 presents God's speech as having this same creative, reality-constituting power — but on a cosmic scale.",
      },
    ],
  },
  {
    number: 2,
    verses: [
      {
        number: 1,
        english: "Thus the heavens and the earth were completed in all their vast array.",
        malayalam: "ആകാശവും ഭൂമിയും അവയിലുള്ള സർവ്വസൈന്യവും തികഞ്ഞു.",
        hebrew: "וַיְכֻלּוּ הַשָּׁמַיִם וְהָאָרֶץ וְכָל־צְבָאָם",
        hebrewWords: [
          {
            word: "וַיְכֻלּוּ",
            transliteration: "Vaykhulu",
            root: "כלה (kalah)",
            meaning: "Were completed / finished",
            usage: "This verb signals the end of the creative week. The same root appears in the Shabbat kiddush prayer recited every Friday night.",
          },
          {
            word: "צְבָאָם",
            transliteration: "Tzva'am",
            root: "צבא (tzava)",
            meaning: "Their vast array / their hosts",
            usage: "Tzava means army or host. God is called 'LORD of hosts' (YHWH Tzvaot) throughout the prophets.",
          },
        ],
        explanation:
          "The word 'completed' (vaykhulu) echoes through Jewish liturgy to this day — it opens the Shabbat evening kiddush. The ancient rabbis understood that resting on the seventh day was not God being tired. It was God declaring the work good and complete. Completion is a theological act, not just a practical one.",
        realLifeExample:
          "There is a difference between stopping work and completing work. A surgeon who walks out mid-operation has stopped. A surgeon who closes, bandages, and signs off has completed. Genesis 2:1 is about completion — the universe declared whole, not just paused.",
      },
      {
        number: 2,
        english:
          "By the seventh day God had finished the work he had been doing; so on the seventh day he rested from all his work.",
        malayalam:
          "ഏഴാം ദിവസം ദൈവം തന്റെ പ്രവൃത്തി തീർത്തു; ഏഴാം ദിവസം തന്റെ സകല പ്രവൃത്തിയിൽ നിന്നും സ്വസ്ഥനായി.",
        hebrew:
          "וַיְכַל אֱלֹהִים בַּיּוֹם הַשְּׁבִיעִי מְלַאכְתּוֹ אֲשֶׁר עָשָׂה וַיִּשְׁבֹּת בַּיּוֹם הַשְּׁבִיעִי מִכָּל־מְלַאכְתּוֹ אֲשֶׁר עָשָׂה",
        hebrewWords: [
          {
            word: "וַיִּשְׁבֹּת",
            transliteration: "Vayishbot",
            root: "שבת (shavat)",
            meaning: "And he rested / ceased",
            usage: "The root of Shabbat. It doesn't mean to sleep or recover — it means to stop, to cease intentionally. God's rest is deliberate cessation, not exhaustion.",
          },
          {
            word: "מְלַאכְתּוֹ",
            transliteration: "Melakhto",
            root: "מלאכה (melakhah)",
            meaning: "His work",
            usage: "Melakhah is the same word used for the categories of work prohibited on Shabbat. 39 categories are defined in the Talmud, all derived from work done to build the Tabernacle.",
          },
        ],
        explanation:
          "The seventh day has no evening and morning — unlike the previous six days. Every other day ends with 'and there was evening and morning.' The seventh day is open-ended. Some rabbis read this as saying Shabbat never truly ended — we are still in it. The rest of God is ongoing, and humans are invited into it.",
        realLifeExample:
          "In Japanese philosophy, there is a concept called 'ma' — the meaningful pause between actions. It's not emptiness; it's the space that gives everything around it meaning. God's Shabbat rest is ma on a cosmic scale — the pause that makes everything before it meaningful.",
      },
      {
        number: 3,
        english:
          "Then God blessed the seventh day and made it holy, because on it he rested from all the work of creating that he had done.",
        malayalam:
          "ദൈവം ഏഴാം ദിവസത്തെ അനുഗ്രഹിച്ചു, അതിനെ വിശുദ്ധീകരിച്ചു; അതിൽ തന്റെ സൃഷ്ടിക്കുള്ള സകല പ്രവൃത്തിയിൽ നിന്നും സ്വസ്ഥനായതുകൊണ്ടു.",
        hebrew:
          "וַיְבָרֶךְ אֱלֹהִים אֶת־יוֹם הַשְּׁבִיעִי וַיְקַדֵּשׁ אֹתוֹ כִּי בוֹ שָׁבַת מִכָּל־מְלַאכְתּוֹ אֲשֶׁר־בָּרָא אֱלֹהִים לַעֲשׂוֹת",
        hebrewWords: [
          {
            word: "וַיְבָרֶךְ",
            transliteration: "Vayvarekh",
            root: "ברך (barakh)",
            meaning: "And he blessed",
            usage: "God has blessed animals and humans before. But this is the first time God blesses a unit of time. Not a place, not a person — a day.",
          },
          {
            word: "וַיְקַדֵּשׁ",
            transliteration: "Vayekadesh",
            root: "קדש (kadash)",
            meaning: "Made holy / sanctified",
            usage: "The root of kiddush, kadosh, kedushah — the entire Hebrew vocabulary of holiness flows from this moment. The first holy thing in the Bible is not a temple. It is time.",
          },
        ],
        explanation:
          "This is one of the most radical ideas in all of ancient religion: the first thing God declares holy is not a place — not a mountain, not a temple, not an altar. It is a day. Time itself is the first sanctuary. The later Temple in Jerusalem was built to embody in space what Shabbat embodies in time.",
        realLifeExample:
          "Every culture has sacred places — shrines, temples, churches, mosques. Genesis 2:3 says the first sacred thing God created was not a location you travel to, but a moment that comes to you. Holiness, in the biblical imagination, is woven into time itself.",
      },
    ],
  },
  {
    number: 3,
    verses: [
      {
        number: 1,
        english:
          "Now the serpent was more crafty than any of the wild animals the LORD God had made. He said to the woman, 'Did God really say, You must not eat from any tree in the garden?'",
        malayalam:
          "യഹോവയായ ദൈവം ഉണ്ടാക്കിയ സകല വയൽമൃഗങ്ങളിലും പാമ്പു തന്ത്രശാലിയായിരുന്നു. അതു സ്ത്രീയോടു: ഒരു വൃക്ഷത്തിന്റെ ഫലവും നിങ്ങൾ തിന്നരുതെന്നു ദൈവം വാസ്തവമായി കല്പിച്ചുവോ എന്നു ചോദിച്ചു.",
        hebrew:
          "וְהַנָּחָשׁ הָיָה עָרוּם מִכֹּל חַיַּת הַשָּׂדֶה אֲשֶׁר עָשָׂה יְהוָה אֱלֹהִים וַיֹּאמֶר אֶל־הָאִשָּׁה אַף כִּי־אָמַר אֱלֹהִים לֹא תֹאכְלוּ מִכֹּל עֵץ הַגָּן",
        hebrewWords: [
          {
            word: "הַנָּחָשׁ",
            transliteration: "HaNachash",
            root: "נחש (nachash)",
            meaning: "The serpent",
            usage: "Nachash can mean serpent, but the root also means 'to practice divination.' The serpent is associated with hidden knowledge from the very beginning.",
          },
          {
            word: "עָרוּם",
            transliteration: "Arum",
            root: "ערם (aram)",
            meaning: "Crafty / shrewd / subtle",
            usage: "The same Hebrew root means both 'crafty' (negative) and 'prudent/wise' (positive) in Proverbs. The serpent's quality is morally ambiguous.",
          },
        ],
        explanation:
          "The serpent in Genesis 3 is not identified as Satan in the original text — that identification came much later in Jewish and Christian interpretation. The text simply calls it the most arum (crafty) of animals. Its first move is not a direct lie — it is a question that distorts God's actual words. God said 'don't eat from one tree.' The serpent says 'did God say you can't eat from any tree?' Deception begins with exaggeration.",
        realLifeExample:
          "The serpent's technique is still the oldest trick in manipulation: don't lie outright — misquote. Take what was said and stretch it just slightly beyond recognition. 'Did he really say that?' is the beginning of every gaslighting conversation ever recorded.",
      },
      {
        number: 2,
        english:
          "The woman said to the serpent, 'We may eat fruit from the trees in the garden, but God did say, You must not eat fruit from the tree that is in the middle of the garden, and you must not touch it, or you will die.'",
        malayalam:
          "സ്ത്രീ പാമ്പിനോടു: തോട്ടത്തിലുള്ള വൃക്ഷങ്ങളുടെ ഫലം ഞങ്ങൾ തിന്നാം; എന്നാൽ തോട്ടത്തിന്റെ നടുവിലുള്ള വൃക്ഷത്തിന്റെ ഫലം തിന്നരുതു, തൊടുകയും അരുതു; തൊട്ടാൽ നിങ്ങൾ മരിക്കും എന്നു ദൈവം കല്പിച്ചിട്ടുണ്ടു എന്നു പറഞ്ഞു.",
        hebrew:
          "וַתֹּאמֶר הָאִשָּׁה אֶל־הַנָּחָשׁ מִפְּרִי עֵץ־הַגָּן נֹאכֵל וּמִפְּרִי הָעֵץ אֲשֶׁר בְּתוֹךְ־הַגָּן אָמַר אֱלֹהִים לֹא תֹאכְלוּ מִמֶּנּוּ וְלֹא תִגְּעוּ בּוֹ פֶּן־תְּמֻתוּן",
        hebrewWords: [
          {
            word: "וְלֹא תִגְּעוּ",
            transliteration: "V'lo tig'u",
            root: "נגע (naga)",
            meaning: "And you must not touch",
            usage: "God never said 'don't touch' — only 'don't eat.' The woman has already added to the commandment. This is the first human expansion of divine law in the Bible.",
          },
          {
            word: "פֶּן־תְּמֻתוּן",
            transliteration: "Pen-temutun",
            root: "מות (mut)",
            meaning: "Lest you die",
            usage: "God said 'you will surely die' (mot tamut). The woman softens it to 'lest you die' — a subtle weakening of the consequence that makes the serpent's next move easier.",
          },
        ],
        explanation:
          "The woman's quotation of God's words contains two small changes: she adds 'don't touch it' (God never said this) and softens 'you will surely die' to 'lest you die.' These are not errors — they are the text showing us how temptation works. The distortion begins before the act. First the command is misrepresented, then the consequence is minimized.",
        realLifeExample:
          "Every legal system knows the danger of people 'interpreting' rules rather than following them. The woman is doing what lawyers call 'creative interpretation' — adding and subtracting from the original in ways that seem minor but shift the entire meaning. The original script is already being rewritten before a single fruit is eaten.",
      },
      {
        number: 3,
        english:
          "'You will not certainly die,' the serpent said to the woman. 'For God knows that when you eat from it your eyes will be opened, and you will be like God, knowing good and evil.'",
        malayalam:
          "പാമ്പു സ്ത്രീയോടു: നിങ്ങൾ മരിക്കയില്ല നിശ്ചയം; നിങ്ങൾ അതു തിന്നുന്ന നാളിൽ നിങ്ങളുടെ കണ്ണു തുറക്കും, നിങ്ങൾ നന്മതിന്മകളെ അറിയുന്ന ദൈവത്തെപ്പോലെ ആകും എന്നു ദൈവം അറിയുന്നു എന്നു പറഞ്ഞു.",
        hebrew:
          "וַיֹּאמֶר הַנָּחָשׁ אֶל־הָאִשָּׁה לֹא־מוֹת תְּמֻתוּן כִּי יֹדֵעַ אֱלֹהִים כִּי בְּיוֹם אֲכָלְכֶם מִמֶּנּוּ וְנִפְקְחוּ עֵינֵיכֶם וִהְיִיתֶם כֵּאלֹהִים יֹדְעֵי טוֹב וָרָע",
        hebrewWords: [
          {
            word: "לֹא־מוֹת תְּמֻתוּן",
            transliteration: "Lo-mot temutun",
            root: "מות (mut)",
            meaning: "You will not certainly die",
            usage: "The serpent directly contradicts God. This is the first explicit lie in the Bible. It mirrors God's exact words but inverts the meaning completely.",
          },
          {
            word: "כֵּאלֹהִים",
            transliteration: "Ke'Elohim",
            root: "אל (El)",
            meaning: "Like God / like divine beings",
            usage: "The ultimate temptation — not just knowledge, but equality with God. This phrase echoes through the rest of scripture as the archetype of human overreach.",
          },
          {
            word: "טוֹב וָרָע",
            transliteration: "Tov vaRa",
            root: "טוב / רע",
            meaning: "Good and evil",
            usage: "In Hebrew idiom, 'knowing good and evil' means knowing everything — a merism, like saying 'from A to Z.' It is the knowledge of all things, not just moral categories.",
          },
        ],
        explanation:
          "The serpent's second move is a direct contradiction of God — 'you will not die.' But notice what follows: the serpent doesn't just lie, it offers a true observation wrapped in a false promise. God does know that eating the fruit will open their eyes. The serpent's lie is not about the fact but about the consequence and the motive. This is the anatomy of sophisticated deception: true premises, false conclusions.",
        realLifeExample:
          "The most effective lies are the ones wrapped in true facts. 'Eating sugar gives you energy' is true — but it leads to a false conclusion about nutrition. The serpent is not wrong that the fruit will open their eyes. It is wrong about what that opening will mean. Every advertisement, every manipulation follows this same structure: accurate facts arranged to produce a false belief.",
      },
    ],
  },
];