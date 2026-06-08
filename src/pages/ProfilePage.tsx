import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { mockAnswers } from "../data/questionData";
import { mockQuestions } from "../data/questionData";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Generate last 30 days
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split("T")[0];
  });

  // Mock answered days — in real app this comes from Sarthak's API
  const answeredDays = new Set([
    days[29], // today
    days[28],
    days[27],
    days[25],
    days[24],
    days[23],
    days[20],
    days[19],
    days[15],
    days[10],
  ]);

  const streak = 3; // mock — comes from backend

  const selectedAnswer = selectedDay
    ? mockAnswers.find((a) => a.questionId === "q1")
    : null;

  const selectedQuestion = selectedDay
    ? mockQuestions[0]
    : null;

  return (
    <div className="min-h-screen bg-ink">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-ink/90 backdrop-blur border-b border-gold/10 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/question")}
          className="text-parchment/50 hover:text-parchment text-sm transition-colors"
        >
          ← Today
        </button>
        <p className="text-gold font-serif font-bold">My Journey</p>
        <button
          onClick={signOut}
          className="text-parchment/30 hover:text-parchment text-xs transition-colors"
        >
          Sign out
        </button>
      </div>

      <div className="max-w-xl mx-auto px-4 pt-24 pb-16">
        {/* User info */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-slate/50 flex items-center justify-center text-2xl font-bold text-gold mx-auto mb-3">
            {user?.email?.charAt(0).toUpperCase() ?? "?"}
          </div>
          <p className="text-parchment font-serif text-xl">
            {user?.email?.split("@")[0] ?? "Explorer"}
          </p>
          <p className="text-parchment/40 text-sm mt-1">{user?.email}</p>
        </div>

        {/* Streak */}
        <div className="flex items-center justify-center gap-6 mb-10">
          <div className="text-center">
            <p className="text-4xl font-serif text-gold font-bold">
              🔥 {streak}
            </p>
            <p className="text-parchment/40 text-xs mt-1">Day streak</p>
          </div>
          <div className="w-px h-10 bg-parchment/10" />
          <div className="text-center">
            <p className="text-4xl font-serif text-gold font-bold">
              {answeredDays.size}
            </p>
            <p className="text-parchment/40 text-xs mt-1">Days answered</p>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="mb-8">
          <p className="text-parchment/40 text-xs uppercase tracking-widest mb-4">
            Last 30 Days
          </p>
          <div className="grid grid-cols-10 gap-2">
            {days.map((day) => {
              const answered = answeredDays.has(day);
              const isSelected = selectedDay === day;
              const isToday = day === new Date().toISOString().split("T")[0];
              return (
                <button
                  key={day}
                  onClick={() => answered && setSelectedDay(isSelected ? null : day)}
                  className={`w-full aspect-square rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-gold scale-110"
                      : answered
                      ? "bg-gold/70 hover:bg-gold"
                      : isToday
                      ? "border border-gold/30 bg-transparent"
                      : "bg-parchment/5"
                  } ${answered ? "cursor-pointer" : "cursor-default"}`}
                >
                  {isToday && !answered && (
                    <span className="w-1 h-1 rounded-full bg-gold/50 block" />
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-3 h-3 rounded-full bg-gold/70" />
            <span className="text-parchment/30 text-xs">Answered</span>
            <div className="w-3 h-3 rounded-full bg-parchment/5 ml-3" />
            <span className="text-parchment/30 text-xs">Missed</span>
          </div>
        </div>

        {/* Selected day answer */}
        {selectedDay && selectedAnswer && selectedQuestion && (
          <div className="border border-gold/20 rounded-xl p-6 bg-gold/5">
            <p className="text-gold/60 text-xs uppercase tracking-widest mb-2">
              {new Date(selectedDay).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-parchment/60 font-serif italic text-sm mb-4">
              "{selectedQuestion.text}"
            </p>
            <p className="text-parchment text-sm leading-relaxed">
              {selectedAnswer.answer}
            </p>
          </div>
        )}

        {/* Navigation to Codex */}
        <div className="mt-10 space-y-3">
          <p className="text-parchment/30 text-xs uppercase tracking-widest mb-4">
            Continue Learning
          </p>
          <button
            onClick={() => navigate("/codex")}
            className="w-full flex items-center justify-between p-4 border border-parchment/10 rounded-xl hover:border-gold/20 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">📜</span>
              <div className="text-left">
                <p className="text-parchment text-sm">The Codex</p>
                <p className="text-parchment/30 text-xs">Genesis · Chapter 1</p>
              </div>
            </div>
            <span className="text-parchment/30">→</span>
          </button>
          <button
            onClick={() => navigate("/conquest")}
            className="w-full flex items-center justify-between p-4 border border-parchment/10 rounded-xl hover:border-gold/20 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">⚔️</span>
              <div className="text-left">
                <p className="text-parchment text-sm">Conquest Mode</p>
                <p className="text-parchment/30 text-xs">Hebrew word study</p>
              </div>
            </div>
            <span className="text-parchment/30">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}