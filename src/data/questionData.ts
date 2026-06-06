export interface Question {
  id: string;
  date: string; // YYYY-MM-DD
  text: string;
  scripture: {
    reference: string;
    passage: string;
  };
}

export interface Answer {
  id: string;
  questionId: string;
  userId: string;
  userName: string;
  pathway: string;
  answer: string;
  timeAgo: string;
  replies: Reply[];
}

export interface Reply {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timeAgo: string;
}

// Mock questions — Paul's team will supply real ones
export const mockQuestions: Question[] = [
  {
    id: "q1",
    date: "2026-06-06",
    text: "Genesis 1:2 says the Spirit of God hovered over the waters before anything was created. What do you think was happening in that moment?",
    scripture: {
      reference: "Genesis 1:2",
      passage:
        "The earth was without form and void, and darkness was over the face of the deep. And the Spirit of God was hovering over the face of the waters.",
    },
  },
  {
    id: "q2",
    date: "2026-06-07",
    text: "God said 'Let there be light' before creating the sun. What kind of light do you think this was?",
    scripture: {
      reference: "Genesis 1:3",
      passage: "And God said, 'Let there be light,' and there was light.",
    },
  },
  {
    id: "q3",
    date: "2026-06-08",
    text: "The seventh day has no evening and morning — unlike every other day of creation. Why do you think the text leaves it open-ended?",
    scripture: {
      reference: "Genesis 2:2-3",
      passage:
        "By the seventh day God had finished the work he had been doing; so on the seventh day he rested from all his work. Then God blessed the seventh day and made it holy.",
    },
  },
];

// Mock community answers
export const mockAnswers: Answer[] = [
  {
    id: "a1",
    questionId: "q1",
    userId: "u1",
    userName: "Susan T.",
    pathway: "Wisdom Seeker",
    answer:
      "I always imagined it as God preparing — like how a mother holds her breath before speaking something into existence. There was intention before there was action.",
    timeAgo: "2h ago",
    replies: [
      {
        id: "r1",
        userId: "u2",
        userName: "Thomas M.",
        text: "This is beautiful. The maternal image of hovering really changes how I read this.",
        timeAgo: "1h ago",
      },
    ],
  },
  {
    id: "a2",
    questionId: "q1",
    userId: "u2",
    userName: "Thomas M.",
    pathway: "Serious Learner",
    answer:
      "The Hebrew word merachefet — hovering — is the same word used for an eagle over its nest in Deuteronomy. God wasn't passive. God was protecting what was about to be born.",
    timeAgo: "3h ago",
    replies: [],
  },
  {
    id: "a3",
    questionId: "q1",
    userId: "u3",
    userName: "Rev. Jacob K.",
    pathway: "Church Leader",
    answer:
      "In the ancient Near East, chaos was something to be feared and fought. Genesis presents God not fighting chaos but hovering over it — completely unafraid. That changes everything about how we understand divine power.",
    timeAgo: "4h ago",
    replies: [],
  },
  {
    id: "a4",
    questionId: "q1",
    userId: "u4",
    userName: "Priya N.",
    pathway: "Theology Student",
    answer:
      "The Septuagint translates this differently from the Masoretic text. The Greek pneuma theou suggests a wind, not a spirit. The ambiguity is intentional — both readings are theologically valid.",
    timeAgo: "5h ago",
    replies: [],
  },
];

export function getTodayQuestion(): Question {
  const today = new Date().toISOString().split("T")[0];
  return (
    mockQuestions.find((q) => q.date === today) ?? mockQuestions[0]
  );
}