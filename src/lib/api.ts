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
export async function fetchTodayQuestion(pathway?: string): Promise<ApiQuestion> {
  const qs = pathway ? `?pathway=${encodeURIComponent(pathway)}` : "";
  return handle<ApiQuestion>(await fetch(`${API_URL}/api/questions/today${qs}`));
}

// GET all answers (with nested replies) for a question. Public.
export async function fetchAnswers(questionId: string): Promise<ApiAnswer[]> {
  return handle<ApiAnswer[]>(await fetch(`${API_URL}/api/questions/${questionId}/answers`));
}

// POST an answer; returns the created answer plus `modelAnswer` (the reveal). Auth.
export async function postAnswer(
  questionId: string,
  answer: string,
): Promise<ApiAnswer & { modelAnswer: string | null }> {
  return handle(
    await fetch(`${API_URL}/api/questions/${questionId}/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(await authHeaders()) },
      body: JSON.stringify({ answer }),
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
