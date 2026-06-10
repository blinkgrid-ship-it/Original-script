// Mock community profiles — replaced by Sarthak's GET /api/user/:user_id/profile

export interface PublicProfile {
  userId: string;
  name: string;
  pathway: string;
  level: string;
  xp: number;
  streak: number;
  wordsMastered: number;
  totalAnswers: number;
  chaptersRead: number[];
  conquestDone: number[];
  recentAnswers: { question: string; answer: string; date: string }[];
}

export const mockCommunityProfiles: PublicProfile[] = [
  {
    userId: "user_sarah",
    name: "Sarah Mathew",
    pathway: "theology-student",
    level: "Scholar",
    xp: 275,
    streak: 14,
    wordsMastered: 5,
    totalAnswers: 18,
    chaptersRead: [1, 2],
    conquestDone: [1],
    recentAnswers: [
      {
        question: "What does Genesis 1:2 reveal about the nature of God before creation?",
        answer:
          "The Spirit hovering over the waters feels deeply maternal to me — like a creator unwilling to leave their work unattended. It speaks of intention before action, which changes how I think about my own creative process.",
        date: "2026-06-08",
      },
      {
        question: "Why do you think darkness precedes light in the creation account?",
        answer:
          "Every meaningful thing I've experienced started in a kind of darkness — uncertainty, not-knowing. Genesis seems to be saying this is the natural order, not an accident.",
        date: "2026-06-07",
      },
      {
        question: "What is the significance of 'bara' versus 'asah' in Genesis?",
        answer:
          "Bara implies something entirely new — ex nihilo. Asah is more like shaping what exists. The distinction shows God as both originator and craftsman, which feels more personal than distant creator.",
        date: "2026-06-06",
      },
    ],
  },
  {
    userId: "user_thomas",
    name: "Thomas Varghese",
    pathway: "serious-learner",
    level: "Scribe",
    xp: 450,
    streak: 21,
    wordsMastered: 8,
    totalAnswers: 26,
    chaptersRead: [1, 2, 3],
    conquestDone: [1, 2],
    recentAnswers: [
      {
        question: "What does Genesis 1:2 reveal about the nature of God before creation?",
        answer:
          "Tohu wa-bohu — formless and void — isn't described as evil or bad. It's just raw potential. That reframes the whole narrative: God doesn't destroy darkness, God organises it.",
        date: "2026-06-08",
      },
      {
        question: "Why do you think darkness precedes light in the creation account?",
        answer:
          "Ancient cosmology consistently places chaos before order. The genius of Genesis is that chaos isn't the enemy — it's the canvas.",
        date: "2026-06-07",
      },
      {
        question: "What is the significance of 'bara' versus 'asah' in Genesis?",
        answer:
          "I think this distinction has been deliberately flattened in most English translations. The Hebrew is showing us layers — cosmic creation vs. intimate crafting. We lose that when both become 'made'.",
        date: "2026-06-06",
      },
    ],
  },
  {
    userId: "user_priya",
    name: "Priya John",
    pathway: "wisdom-seeker",
    level: "Seeker",
    xp: 75,
    streak: 4,
    wordsMastered: 0,
    totalAnswers: 7,
    chaptersRead: [1],
    conquestDone: [],
    recentAnswers: [
      {
        question: "What does Genesis 1:2 reveal about the nature of God before creation?",
        answer:
          "I never thought about the Spirit actively hovering. I always imagined creation as God speaking from a distance. The hovering makes it feel close, involved. I like that.",
        date: "2026-06-08",
      },
      {
        question: "Why do you think darkness precedes light in the creation account?",
        answer:
          "Maybe because we only recognise light when we've been in the dark. Contrast as a condition for understanding.",
        date: "2026-06-06",
      },
      {
        question: "What is the significance of 'bara' versus 'asah' in Genesis?",
        answer:
          "I'm still learning Hebrew so this is new to me. But knowing this distinction makes me want to go back and reread everything with that lens.",
        date: "2026-06-04",
      },
    ],
  },
  {
    userId: "user_george",
    name: "George Kurian",
    pathway: "church-leader",
    level: "Sage",
    xp: 720,
    streak: 30,
    wordsMastered: 11,
    totalAnswers: 30,
    chaptersRead: [1, 2, 3],
    conquestDone: [1, 2, 3],
    recentAnswers: [
      {
        question: "What does Genesis 1:2 reveal about the nature of God before creation?",
        answer:
          "I've preached on this passage dozens of times and the Hebrew never ceases to surface new dimensions. The word 'merachefet' — hovering — appears only one other time in scripture: Deuteronomy 32:11, an eagle stirring its nest. Protection before formation.",
        date: "2026-06-08",
      },
      {
        question: "Why do you think darkness precedes light in the creation account?",
        answer:
          "Theologically, darkness is not the absence of God. It is the space in which God chooses to speak. That changes our pastoral approach to suffering entirely.",
        date: "2026-06-07",
      },
      {
        question: "What is the significance of 'bara' versus 'asah' in Genesis?",
        answer:
          "Seminary taught me one thing. Original Script is teaching me another. The gap between the two is where real faith lives.",
        date: "2026-06-06",
      },
    ],
  },
];

// Map answer userId to a mock profile for community feed display
export const profileByUserId: Record<string, PublicProfile> = Object.fromEntries(
  mockCommunityProfiles.map((p) => [p.userId, p])
);

// Fallback for userIds not in the mock set
export function getMockProfile(userId: string): PublicProfile {
  return (
    profileByUserId[userId] ?? {
      userId,
      name: userId,
      pathway: "wisdom-seeker",
      level: "Seeker",
      xp: 50,
      streak: 1,
      wordsMastered: 0,
      totalAnswers: 1,
      chaptersRead: [],
      conquestDone: [],
      recentAnswers: [],
    }
  );
}