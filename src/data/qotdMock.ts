// Static mock data for Question of the Day — used while the backend is not yet hosted.
// Matches the shapes returned by the backend question endpoints.
import type { ApiQuestion, ApiAnswer } from "../lib/api";

export const MOCK_QUESTION_ID = "mock-qotd-001";

export const mockQuestion: ApiQuestion = {
  id: MOCK_QUESTION_ID,
  date: new Date().toISOString(),
  text: "When God called the light 'good' in Genesis 1, what does that tell us about how He sees the things He creates — and how should that change the way we see ourselves?",
  scripture: {
    reference: "Genesis 1:3–4",
    passage:
      "And Elohim said, 'Let there be light,' and there was light. Elohim saw that the light was good, and He separated the light from the darkness.",
  },
  theme: "Creation & Identity",
  pathway: null,
};

export const mockAnswers: ApiAnswer[] = [
  {
    id: "mock-ans-001",
    questionId: MOCK_QUESTION_ID,
    userId: "mock-user-001",
    userName: "Sarah M.",
    pathway: "wisdom-seeker",
    answer:
      "It tells me that goodness was declared before anything was earned. The light didn't have to do anything to be called good — it simply existed as God made it. That's incredibly freeing when I think about my own identity.",
    timeAgo: "2h ago",
    replies: [
      {
        id: "mock-reply-001",
        userId: "mock-user-002",
        userName: "James T.",
        text: "This really hit me. We spend so much time trying to earn that label when it was already spoken over us at creation.",
        timeAgo: "1h ago",
      },
    ],
  },
  {
    id: "mock-ans-002",
    questionId: MOCK_QUESTION_ID,
    userId: "mock-user-003",
    userName: "Priya K.",
    pathway: "theology-student",
    answer:
      "The Hebrew word 'tov' means more than morally good — it means fitting, complete, purposeful. So when God calls light good, He's saying it's exactly what it was meant to be. That reframes everything.",
    timeAgo: "3h ago",
    replies: [],
  },
  {
    id: "mock-ans-003",
    questionId: MOCK_QUESTION_ID,
    userId: "mock-user-004",
    userName: "Daniel O.",
    pathway: "serious-learner",
    answer:
      "I think it's God modelling something for us — He pauses, looks at what He made, and pronounces it good. We rarely pause to do that with anything, let alone ourselves.",
    timeAgo: "5h ago",
    replies: [],
  },
];
