// src/lib/api.ts
// Thin client for the Original Script backend (Express API). Reads the base URL from
// VITE_API_URL, defaulting to the local dev server. Auth'd calls attach the current
// Supabase JWT as a Bearer token (the backend's requireAuth verifies it).
import { supabase } from "./supabase";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

// Shapes returned by the backend — these line up with src/data/questionData.ts.
export interface ApiQuestion {
  id: string;
  date: string;
  text: string;
  scripture: { reference: string; passage: string };
  theme: string | null;
  pathway: string | null;
}

export interface ApiReply {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timeAgo: string;
}

export interface ApiAnswer {
  id: string;
  questionId: string;
  userId: string;
  userName: string;
  pathway: string;
  answer: string;
  timeAgo: string;
  replies: ApiReply[];
}

// Attach the Bearer token for authenticated requests (empty when signed out).
async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Parse the JSON body and throw the backend's error message on a non-2xx response.
async function handle<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((body as { error?: string }).error ?? `Request failed (${res.status})`);
  return body as T;
}

// GET today's question (optionally segmented by pathway). Public.
// Returns static mock data while the backend is not yet hosted.
export async function fetchTodayQuestion(_pathway?: string): Promise<ApiQuestion> {
  const { mockQuestion } = await import("../data/qotdMock");
  return mockQuestion;
}

// GET all answers (with nested replies) for a question. Public.
// Returns static mock answers while the backend is not yet hosted.
export async function fetchAnswers(_questionId: string): Promise<ApiAnswer[]> {
  const { mockAnswers } = await import("../data/qotdMock");
  return mockAnswers;
}

// The current user's own answer to a question (+ the revealed model answer), if any. Auth.
export interface MyAnswer {
  answered: boolean;
  answer?: string;
  modelAnswer?: string | null;
}
export async function fetchMyAnswer(_questionId: string): Promise<MyAnswer> {
  return { answered: false };
}

// POST an answer; returns the created answer plus `modelAnswer` (the reveal). Auth.
// Returns a mock response while the backend is not yet hosted.
export async function postAnswer(
  questionId: string,
  answer: string,
): Promise<ApiAnswer & { modelAnswer: string | null }> {
  const { mockQuestion } = await import("../data/qotdMock");
  return {
    id: "mock-ans-new",
    questionId,
    userId: "mock-user-me",
    userName: "You",
    pathway: "",
    answer,
    timeAgo: "just now",
    replies: [],
    modelAnswer: mockQuestion.scripture.passage,
  };
}

// ── OSR verse reader (the founder's verse-by-verse vision) ──────────────────────
export interface VerseData {
  verseRef: string;
  book: string;
  chapter: number;
  verse: number;
  osrText: string;
  hebrewText: string | null;
  transliteration: string | null;
  ndh: { code: string | null; confidence: string | null };
  // jars keyed by jar_type (osr_commentary, word_study, theology, ...); shape varies.
  jars: Record<string, any>;
}

// GET an assembled verse + all its commentary jars. Public.
// Genesis 1:1 is served from static mock data while the backend is not yet hosted.
export async function fetchVerse(
  book: string,
  chapter: number | string,
  verse: number | string,
): Promise<VerseData> {
  if (book.toLowerCase() === "genesis" && String(chapter) === "1" && String(verse) === "1") {
    const { default: mock } = await import("../data/gen1mock");
    return mock;
  }
  return handle<VerseData>(await fetch(`${API_URL}/api/verse/${book}/${chapter}/${verse}`));
}

// ── ETU reader (bilingual/multilingual chapter view, backed by Verse + VerseTranslation) ──
export interface ChapterVerse {
  verseRef: string;
  verseNumber: number;
  // Stable verse identity — highlights are keyed off this, not the verse UUID.
  verseFingerprint: string | null;
  osrText: string;
  hebrewText: string | null;
  ndh: { code: string | null; confidence: string | null };
  // Keyed by ISO language code, e.g. { ml: "...", ta: "..." }. Missing key = not translated yet.
  translations: Record<string, string>;
}
export interface ChapterData {
  book: string;
  chapter: number;
  verses: ChapterVerse[];
}

// GET every verse in a chapter (OSR text, Hebrew, translations). Public. Tries the real
// backend first; if it's unreachable (e.g. the live site has no backend hosted yet —
// see genesis1mock.ts), Genesis 1 falls back to a frozen real-content snapshot so the
// deployed site isn't just empty. Any other book/chapter still surfaces the real error.
// Returns `verses: []` for a book/chapter with no content yet (not an error).
export async function fetchChapter(book: string, chapter: number | string): Promise<ChapterData> {
  try {
    return await handle<ChapterData>(await fetch(`${API_URL}/api/chapter/${book}/${chapter}`));
  } catch (err) {
    if (book.toLowerCase() === "genesis" && String(chapter) === "1") {
      const { default: mock } = await import("../data/genesis1mock");
      return mock;
    }
    throw err;
  }
}

// ── Verse highlights (ETU reader; per-user, persisted) ──────────────────────────
export interface Highlight {
  verseFingerprint: string;
  book: string;
  chapter: number;
  verse: number;
  color: string; // hex
  style: "highlight" | "underline";
  updatedAt: string;
}

// The current user's highlights, optionally scoped to one book+chapter (the ETU
// reader passes book+chapter on load; the "My Highlights" panel omits them). Auth —
// returns an empty list rather than throwing when signed out.
export async function fetchHighlights(
  scope?: { book: string; chapter: number | string },
): Promise<Highlight[]> {
  const headers = await authHeaders();
  if (!("Authorization" in headers)) return []; // signed out — nothing to fetch
  const q = scope ? `?book=${encodeURIComponent(scope.book)}&chapter=${scope.chapter}` : "";
  const body = await handle<{ success: boolean; highlights: Highlight[] }>(
    await fetch(`${API_URL}/api/highlights${q}`, { headers }),
  );
  return body.highlights;
}

// Create or update the current user's highlight for a verse. Auth.
export async function saveHighlight(
  verseFingerprint: string,
  color: string,
  style: "highlight" | "underline",
): Promise<Highlight> {
  const body = await handle<{ success: boolean; highlight: Highlight }>(
    await fetch(`${API_URL}/api/highlights`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(await authHeaders()) },
      body: JSON.stringify({ verseFingerprint, color, style }),
    }),
  );
  return body.highlight;
}

// Remove the current user's highlight for a verse. Auth. Idempotent.
export async function deleteHighlight(verseFingerprint: string): Promise<void> {
  await handle(
    await fetch(`${API_URL}/api/highlights/${encodeURIComponent(verseFingerprint)}`, {
      method: "DELETE",
      headers: await authHeaders(),
    }),
  );
}

// POST a reply to an answer. Auth.
export async function postReply(answerId: string, text: string): Promise<ApiReply> {
  return handle<ApiReply>(
    await fetch(`${API_URL}/api/answers/${answerId}/replies`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(await authHeaders()) },
      body: JSON.stringify({ text }),
    }),
  );
}

// POST the signed-in user's onboarding pathway. Auth.
export async function postPathway(pathway: string): Promise<{ success: boolean; pathway: string }> {
  return handle(
    await fetch(`${API_URL}/api/me/pathway`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(await authHeaders()) },
      body: JSON.stringify({ pathway }),
    }),
  );
}

// GET the signed-in user's own profile, including `onboarded` (true once a pathway has
// been chosen) — used to decide whether a freshly signed-in user needs onboarding. Auth.
export async function fetchMe(): Promise<{ email: string; pathway: string | null; onboarded: boolean }> {
  return handle(await fetch(`${API_URL}/api/me`, { headers: await authHeaders() }));
}

// ── Admin portal (all endpoints require an is_admin user; backend re-checks per call) ──
export interface AdminStats {
  success: boolean;
  verses: { total: number; withHebrew: number; byBook: { book: string; verses: number }[] };
  translations: { language: string; verses: number }[];
  users: { total: number; admins: number };
}
export interface AdminVerse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  osrText: string;
  hebrewText: string | null;
  transliteration: string | null;
  ndh: { code: string | null; confidence: string | null };
  translations: Record<string, string>;
}
export interface AdminVerseList {
  success: boolean;
  total: number;
  page: number;
  pageSize: number;
  verses: AdminVerse[];
}
export interface ImportRowError { rowNumber: number; ref: string; error: string }
export interface ImportPreview {
  success: boolean;
  dryRun: boolean;
  totalRows: number;
  toCreate: number;
  toUpdate: number;
  errorCount: number;
  errors: ImportRowError[];
}
export interface ImportResult {
  success: boolean;
  totalRows: number;
  created: number;
  updated: number;
  skipped: number;
  errors: ImportRowError[];
}

// 403 → not an admin; the layout uses this to bounce non-admins to /home.
export async function fetchAdminMe(): Promise<{ isAdmin: boolean; email: string | null }> {
  return handle(await fetch(`${API_URL}/api/admin/me`, { headers: await authHeaders() }));
}

export async function fetchAdminStats(): Promise<AdminStats> {
  return handle(await fetch(`${API_URL}/api/admin/stats`, { headers: await authHeaders() }));
}

export async function fetchAdminVerses(params: {
  book?: string; chapter?: string; search?: string; page?: number; pageSize?: number;
}): Promise<AdminVerseList> {
  const q = new URLSearchParams();
  if (params.book) q.set('book', params.book);
  if (params.chapter) q.set('chapter', params.chapter);
  if (params.search) q.set('search', params.search);
  q.set('page', String(params.page ?? 1));
  q.set('pageSize', String(params.pageSize ?? 50));
  return handle(await fetch(`${API_URL}/api/admin/verses?${q}`, { headers: await authHeaders() }));
}

export async function createAdminVerse(body: {
  book: string; chapter: number; verse: number; osrText: string;
  hebrewText?: string; translations?: Record<string, string>;
}): Promise<{ success: boolean; verse: AdminVerse }> {
  return handle(
    await fetch(`${API_URL}/api/admin/verses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
      body: JSON.stringify(body),
    }),
  );
}

export async function updateAdminVerse(id: string, body: {
  osrText?: string; hebrewText?: string; transliteration?: string;
  translations?: Record<string, string>;
}): Promise<{ success: boolean; verse: AdminVerse }> {
  return handle(
    await fetch(`${API_URL}/api/admin/verses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
      body: JSON.stringify(body),
    }),
  );
}

export async function deleteAdminVerse(id: string): Promise<{ success: boolean }> {
  return handle(
    await fetch(`${API_URL}/api/admin/verses/${id}`, { method: 'DELETE', headers: await authHeaders() }),
  );
}

// mode: which column/table the file fills. book: admin-selected target book — overrides
// the file's Book column (translators often write book names in their own language).
export async function adminImport(
  action: 'preview' | 'commit',
  file: File,
  mode: 'english' | 'hebrew' | 'translation',
  opts: { languageCode?: string; book?: string } = {},
): Promise<ImportPreview & ImportResult> {
  const form = new FormData();
  form.append('file', file);
  form.append('mode', mode);
  if (opts.languageCode) form.append('languageCode', opts.languageCode);
  if (opts.book) form.append('book', opts.book);
  return handle(
    await fetch(`${API_URL}/api/admin/import/${action}`, {
      method: 'POST',
      headers: await authHeaders(), // no Content-Type — browser sets multipart boundary
      body: form,
    }),
  );
}

// Returns the export CSV as a Blob for download.
export async function exportAdminVerses(book?: string): Promise<Blob> {
  const q = book ? `?book=${encodeURIComponent(book)}` : '';
  const res = await fetch(`${API_URL}/api/admin/verses/export${q}`, { headers: await authHeaders() });
  if (!res.ok) throw new Error(`Export failed (${res.status})`);
  return res.blob();
}

// A user's public profile (shape matches src/data/communityData.ts PublicProfile).
export interface ApiProfile {
  userId: string;
  name: string;
  pathway: string | null;
  level: string;
  xp: number;
  streak: number;
  wordsMastered: number;
  totalAnswers: number;
  chaptersRead: number[];
  conquestDone: number[];
  recentAnswers: { question: string; answer: string; date: string }[];
}
export async function fetchProfile(userId: string): Promise<ApiProfile> {
  return handle<ApiProfile>(await fetch(`${API_URL}/api/user/${userId}/profile`));
}
