import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { API_BASE } from "../config.js";

export default function Dashboard() {
  const { token } = useContext(AuthContext);
  const [subjects, setSubjects] = useState([]);
  const [weekOffset, setWeekOffset] = useState(0);

  // Fetch subjects & tasks
  const fetchSubjects = async () => {
    const res = await fetch(`${API_BASE}/api/subjects/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setSubjects(await res.json());
  };

  useEffect(() => {
    if (token) fetchSubjects();
  }, [token]);

  // Toggle task completion
  const toggleTaskCompletion = async (taskId, currentStatus) => {
    const res = await fetch(`${API_BASE}/api/tasks/${taskId}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ completed: !currentStatus }),
    });
    if (res.ok) fetchSubjects();
  };

  // ------------------------
  // Weekly calendar logic
  // ------------------------
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7); // Monday
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return {
      label: d.toLocaleDateString("en-IN", { weekday: "short" }),
      date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      fullDate: d,
    };
  });

  const weekStart = start;
  const weekEnd = end;

  // Subject color palette
  const colors = [
    { bg: "bg-yellow-100", border: "border-yellow-500", text: "text-yellow-800", solid: "bg-yellow-500" },
    { bg: "bg-blue-100", border: "border-blue-500", text: "text-blue-800", solid: "bg-blue-500" },
    { bg: "bg-green-100", border: "border-green-500", text: "text-green-800", solid: "bg-green-500" },
    { bg: "bg-purple-100", border: "border-purple-500", text: "text-purple-800", solid: "bg-purple-500" },
    { bg: "bg-pink-100", border: "border-pink-500", text: "text-pink-800", solid: "bg-pink-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-extrabold text-[#1B4F72] mb-10 tracking-tight">
        📅 Dashboard – <span className="text-[#F1C40F]">Exam Planner</span>
      </h1>

      {/* ----------------------- */}
      {/* Weekly Timetable */}
      {/* ----------------------- */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-12 border">
        <h2 className="text-2xl font-bold text-edublue mb-6 flex items-center gap-2">
          🗓 Weekly Study Timetable
        </h2>

        {/* Week Navigation */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setWeekOffset(weekOffset - 1)}
            className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            ⬅ Previous
          </button>
          <span className="font-semibold text-gray-700 text-lg">
            {weekStart.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} –{" "}
            {weekEnd.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </span>
          <button
            onClick={() => setWeekOffset(weekOffset + 1)}
            className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            Next ➡
          </button>
        </div>

        {/* Days Header (Desktop only) */}
        <div className="hidden md:grid grid-cols-7 gap-3 text-center text-gray-700 font-semibold mb-4">
          {weekDays.map((d) => (
            <div
              key={d.label}
              className={`py-3 rounded-lg ${
                d.fullDate.toDateString() === today.toDateString()
                  ? "bg-yellow-200 text-yellow-900"
                  : "bg-gray-100"
              }`}
            >
              {d.label}
              <div className="text-xs text-gray-500">{d.date}</div>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 text-sm">
          {weekDays.map((d, i) => (
            <div
              key={d.label}
              className={`min-h-[160px] border rounded-xl p-3 flex flex-col gap-2 overflow-y-auto hover:shadow-md transition ${
                d.fullDate.toDateString() === today.toDateString()
                  ? "bg-yellow-50 border-yellow-400"
                  : "bg-white"
              }`}
            >
              {/* Show day label on mobile */}
              <div className="md:hidden font-semibold mb-2 text-gray-700">
                {d.label} <span className="text-xs text-gray-500">{d.date}</span>
              </div>

              {subjects.map((s, idx) =>
                s.tasks
                  .filter(
                    (t) =>
                      new Date(t.study_date).toDateString() ===
                      d.fullDate.toDateString()
                  )
                  .map((t) => (
                    <div
                      key={t.id}
                      className={`px-2 py-1 rounded-md text-xs shadow border-l-4 ${colors[idx % colors.length].bg} ${colors[idx % colors.length].border} ${colors[idx % colors.length].text}`}
                    >
                      <span className="font-semibold">{s.name}</span> – Unit {t.unit_number}
                    </div>
                  ))
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          {subjects.map((s, idx) => (
            <div key={s.id} className="flex items-center gap-2">
              <span className={`w-4 h-4 rounded-sm ${colors[idx % colors.length].solid}`}></span>
              <span className="text-gray-700">{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ----------------------- */}
      {/* Subject Progress Cards */}
      {/* ----------------------- */}
      <h2 className="text-2xl font-bold text-edublue mb-6">📘 Subject Progress</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {subjects.map((s, idx) => {
          const total = s.tasks.length;
          const completed = s.tasks.filter((t) => t.completed).length;
          const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

          return (
            <div
              key={s.id}
              className="bg-white rounded-2xl shadow-lg p-6 border hover:shadow-xl transition"
            >
              <h3
                className="text-2xl font-bold mb-3"
                style={{ color: colors[idx % colors.length].solid.replace("bg-", "text-") }}
              >
                {s.name}
              </h3>
              <p className="text-gray-600">📅 Exam Date: {s.exam_date}</p>
              <p className="text-gray-600 mb-4">🏷 Category: {s.category}</p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-[#F1C40F] to-[#3498DB]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Units with Mark as Complete */}
              <div className="space-y-2">
                {s.tasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => toggleTaskCompletion(t.id, t.completed)}
                    className={`block w-full px-4 py-2 rounded-lg text-sm font-medium transition ${
                      t.completed
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-gray-100 hover:bg-yellow-100 text-gray-800"
                    }`}
                  >
                    Unit {t.unit_number} –{" "}
                    {t.completed ? "✔ Completed" : "Mark as Complete"}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
