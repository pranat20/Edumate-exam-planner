import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { API_BASE } from "../config.js";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { CalendarDays, Tag } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Progress() {
  const { token } = useContext(AuthContext);
  const [subjects, setSubjects] = useState([]);

  const fetchSubjects = async () => {
    const res = await fetch(`${API_BASE}/api/subjects/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setSubjects(await res.json());
  };

  useEffect(() => {
    if (token) fetchSubjects();
  }, [token]);

  // Calculate overall progress
  const overallProgress =
    subjects.length > 0
      ? Math.round(
          subjects.reduce((acc, s) => {
            return acc + (s.completed_units / s.total_units || 0);
          }, 0) / subjects.length * 100
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Page Header */}
      <h1 className="text-4xl font-extrabold text-[#1B4F72] mb-4">
        📊 Progress <span className="text-[#F1C40F]">Report</span>
      </h1>
      <p className="text-gray-700 mb-12 max-w-2xl">
        Track your <strong>syllabus completion</strong> per subject and check
        your <strong>overall preparation</strong> status with visual insights.
      </p>

      {/* Subject Progress Cards */}
      {subjects.length === 0 ? (
        <div className="text-center bg-white p-10 rounded-2xl shadow-md border">
          <p className="text-gray-600 mb-2">No subjects added yet.</p>
          <p className="text-edublue font-medium">
            Go to the <strong>Subjects</strong> page and add your subjects 📘
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {subjects.map((s) => {
            const percent = Math.round(
              (s.completed_units / s.total_units) * 100
            );
            const barColor =
              percent >= 70
                ? "bg-green-500"
                : percent >= 40
                ? "bg-yellow-500"
                : "bg-red-500";

            return (
              <div
                key={s.id}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition transform hover:-translate-y-1 border"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-bold text-[#1B4F72]">{s.name}</h3>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      percent >= 70
                        ? "bg-green-100 text-green-700"
                        : percent >= 40
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {percent}% Done
                  </span>
                </div>

                <p className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                  <CalendarDays className="w-4 h-4 text-gray-500" /> Exam:{" "}
                  <span className="font-medium">{s.exam_date}</span>
                </p>
                <p className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                  <Tag className="w-4 h-4 text-gray-500" /> Category:{" "}
                  <span className="font-medium capitalize">{s.category}</span>
                </p>

                <p className="text-sm text-gray-600 mb-2">
                  {s.completed_units}/{s.total_units} units completed
                </p>

                {/* Progress Bar */}
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${percent}%` }}
                    className={`h-full ${barColor} transition-all duration-700`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Overall Progress Section */}
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-lg mx-auto border">
        <h2 className="text-2xl font-bold text-edublue mb-6 text-center">
          📈 Overall Progress
        </h2>
        <div className="max-w-[300px] mx-auto">
          <Pie
            data={{
              labels: ["Completed", "Remaining"],
              datasets: [
                {
                  data: [overallProgress, 100 - overallProgress],
                  backgroundColor: ["#F1C40F", "#E5E7EB"],
                  hoverBackgroundColor: ["#F39C12", "#D1D5DB"],
                },
              ],
            }}
            options={{
              plugins: {
                legend: {
                  position: "bottom",
                  labels: { color: "#1B4F72" },
                },
              },
            }}
          />
        </div>
        <p className="text-center mt-6 text-gray-700 font-medium text-lg">
          You’ve completed{" "}
          <span className="text-[#F1C40F] font-bold">{overallProgress}%</span>{" "}
          of your entire syllabus 🎯
        </p>
      </div>
    </div>
  );
}
