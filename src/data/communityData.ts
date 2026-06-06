export interface ForumThread {
  id: string;
  title: string;
  category: string;
  author: string;
  location: string;
  replies: number;
  timeAgo: string;
  preview: string;
}

export interface PrayerGroup {
  id: string;
  name: string;
  description: string;
  privacy: "open" | "invite-only";
  members: number;
  maxMembers: number;
  scheduledTime?: string;
}

export interface AudioRoom {
  id: string;
  title: string;
  host: string;
  listeners: number;
  live: boolean;
  topic: string;
}

export const forumThreads: ForumThread[] = [
  {
    id: "1",
    title: "Why does Genesis 1 use Elohim but Genesis 2 uses YHWH?",
    category: "Scripture Discussion",
    author: "Thomas M.",
    location: "London",
    replies: 24,
    timeAgo: "2h ago",
    preview:
      "The shift in divine names between the two creation accounts has fascinated scholars for centuries. The Documentary Hypothesis says two authors — but is that the whole story?",
  },
  {
    id: "2",
    title: "Can a Catholic and a Pentecostal read the same Bible differently and both be right?",
    category: "Faith Questions",
    author: "Amma Susan",
    location: "Dubai",
    replies: 41,
    timeAgo: "5h ago",
    preview:
      "I grew up CSI. My husband is Pentecostal. We read the same verse and see completely different things. Original Script is helping me understand why — but I want to hear your thoughts.",
  },
  {
    id: "3",
    title: "The Documentary Hypothesis — threat to faith or gift to understanding?",
    category: "Theology Debate",
    author: "Rev. Jacob K.",
    location: "Kottayam",
    replies: 67,
    timeAgo: "1d ago",
    preview:
      "JEDP theory is either the most important tool for understanding the Torah or the most dangerous idea in modern biblical scholarship. Let's argue this properly.",
  },
  {
    id: "4",
    title: "Archaeological evidence for the Exodus — where do we stand in 2026?",
    category: "Archaeology",
    author: "Dr. Priya N.",
    location: "Toronto",
    replies: 33,
    timeAgo: "2d ago",
    preview:
      "The absence of direct Egyptian records of the Exodus is used by skeptics as disproof. But absence of evidence is not evidence of absence — here's what we do have.",
  },
];

export const prayerGroups: PrayerGroup[] = [
  {
    id: "1",
    name: "Morning Prayer — Kerala NRI",
    description: "Daily 6am IST prayer session for the Kerala diaspora worldwide.",
    privacy: "open",
    members: 34,
    maxMembers: 50,
    scheduledTime: "6:00 AM IST daily",
  },
  {
    id: "2",
    name: "Genesis Study Prayer Circle",
    description: "Prayer group for those going through the Genesis Codex together.",
    privacy: "open",
    members: 18,
    maxMembers: 25,
    scheduledTime: "Sundays 8:00 PM IST",
  },
  {
    id: "3",
    name: "CSI London Parish",
    description: "Private prayer group for CSI London church members.",
    privacy: "invite-only",
    members: 12,
    maxMembers: 20,
    scheduledTime: "Wednesdays 7:00 PM GMT",
  },
];

export const audioRooms: AudioRoom[] = [
  {
    id: "1",
    title: "Was the Exodus historical? A live debate",
    host: "Dr. Priya N.",
    listeners: 47,
    live: true,
    topic: "Archaeology",
  },
  {
    id: "2",
    title: "Reading Genesis as a Kerala Christian",
    host: "Rev. Jacob K.",
    listeners: 23,
    live: true,
    topic: "Scripture",
  },
  {
    id: "3",
    title: "Hebrew for beginners — weekly session",
    host: "Thomas M.",
    listeners: 0,
    live: false,
    topic: "Language",
  },
];