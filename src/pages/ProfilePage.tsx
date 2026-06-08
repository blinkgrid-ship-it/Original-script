import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { mockAnswers, mockQuestions } from "../data/questionData";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Generate last 30 days ending today
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const days: { date: string; dateObj: Date }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push({
      date: d.toISOString().split("T")[0],
      dateObj: d,
    });
  }

  // Mock: treat u1 as the current user's answered days
  const answeredDates = new Set(
    mockQuestions
      .filter((q) => mockAnswers.some((a) => a.questionId === q.id && a.userId === "u1"))
      .map((q) => q.date)
  );

  // Calculate streak (consecutive days ending today)
  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    if (answeredDates.has(dateStr)) streak++;
    else break;
  }

  const totalAnswered = answeredDates.size;

  // Selected day data
  const selectedQuestion = selectedDay
    ? mockQuestions.find((q) => q.date === selectedDay)
    : null;
  const selectedAnswer = selectedDay
    ? mockAnswers.find(
        (a) =>
          a.userId === "u1" &&
          mockQuestions.find((q) => q.date === selectedDay)?.id === a.questionId
      )
    : null;

  const pathway = localStorage.getItem("os_pathway")
    ?.split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ") ?? "Original Script";

  return (
    <div className="min-h-screen bg-ink pb-8">
      <div className="max-w-2xl mx-auto px-5 pt-6">

        {/* User info */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate/40 flex items-center justify-center text-2xl font-bold text-gold border border-gold/20">
              {user?.email?.charAt(0).toUpperCase() ?? "?"}
            </div>
            <div>
              <p className="text-parchment font-serif text-lg leading-tight">
                {user?.email ?? "Guest"}
              </p>
              <p className="text-parchment/30 text-xs mt-0.5">{pathway}</p>
            </div>
          </div>
          <button
            onClick={async () => {
              await signOut();
              navigate("/");
            }}
            className="text-parchment/30 text-xs hover:text-parchment transition-colors border border-parchment/10 rounded-lg px-3 py-2"
          >
            Sign Out
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="border border-gold/20 rounded-2xl p-5 bg-gold/5 text-center">
            <p className="text-gold font-serif text-4xl font-bold">{streak}</p>
            <p className="text-parchment/40 text-xs uppercase tracking-widest mt-1">
              Day Streak 🔥
            </p>
          </div>
          <div className="border border-parchment/10 rounded-2xl p-5 text-center">
            <p className="text-parchment font-serif text-4xl">{totalAnswered}</p>
            <p className="text-parchment/40 text-xs uppercase tracking-widest mt-1">
              Days Answered
            </p>
          </div>
        </div>

        {/* 30-day calendar */}
        <div className="mb-8">
          <p className="text-parchment/30 text-xs uppercase tracking-widest mb-4">
            Last 30 Days
          </p>
          <div className="grid grid-cols-7 gap-1.5">
            {days.map(({ date, dateObj }) => {
              const answered = answeredDates.has(date);
              const isToday = date === todayStr;
              const isSelected = selectedDay === date;
              return (
                <button
                  key={date}
                  onClick={() =>
                    answered && setSelectedDay(isSelected ? null : date)
                  }
                  disabled={!answered}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center transition-all
                    ${
                      isSelected
                        ? "bg-gold/20 border border-gold"
                        : answered
                        ? "bg-gold/10 border border-gold/30 hover:bg-gold/20 cursor-pointer"
                        : isToday
                        ? "border border-parchment/20 bg-slate/20"
                        : "border border-transparent bg-slate/10 cursor-default"
                    }`}
                >
                  <span
                    className={`text-[10px] ${
                      answered
                        ? "text-gold font-bold"
                        : isToday
                        ? "text-parchment/60"
                        : "text-parchment/20"
                    }`}
                  >
                    {dateObj.getDate()}
                  </span>
                  {answered && (
                    <span className="w-1 h-1 rounded-full bg-gold mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-parchment/20 text-xs mt-3 text-center">
            Tap a gold day to see your answer
          </p>
        </div>

        {/* Selected day answer */}
        {selectedDay && selectedQuestion && (
          <div className="border border-gold/20 rounded-2xl p-5 mb-8 bg-gold/5">
            <p className="text-gold/60 text-xs uppercase tracking-widest mb-2">
              {new Date(selectedDay + "T12:00:00").toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-parchment font-serif text-sm mb-4 leading-relaxed">
              {selectedQuestion.text}
            </p>
            <div className="h-px bg-parchment/10 mb-4" />
            {selectedAnswer ? (
              <p className="text-parchment/70 text-sm leading-relaxed italic">
                "{selectedAnswer.answer}"
              </p>
            ) : (
              <p className="text-parchment/30 text-xs italic">
                No answer recorded for this day.
              </p>
            )}
          </div>
        )}

        {/* Quick links */}
        <p className="text-parchment/30 text-xs uppercase tracking-widest mb-4">
          Continue Learning
        </p>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => navigate("/codex")}
            className="border border-parchment/10 rounded-2xl p-5 text-left hover:border-gold/30 transition-all group"
          >
            <span className="text-2xl block mb-3">📜</span>
            <p className="text-parchment font-serif group-hover:text-gold transition-colors">
              The Codex
            </p>
            <p className="text-parchment/30 text-xs mt-1">Genesis · Hebrew</p>
          </button>
          <button
            onClick={() => navigate("/conquest?chapter=1")}
            className="border border-parchment/10 rounded-2xl p-5 text-left hover:border-gold/30 transition-all group"
          >
            <span className="text-2xl block mb-3">⚔️</span>
            <p className="text-parchment font-serif group-hover:text-gold transition-colors">
              Conquest
            </p>
            <p className="text-parchment/30 text-xs mt-1">Master words · XP</p>
          </button>
        </div>
      </div>
    </div>
  );
}