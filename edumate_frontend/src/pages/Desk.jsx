// src/pages/Desk/Desk.jsx
import { Link } from "react-router-dom";
import { FileText, Edit3, List, RotateCw, Heart, FerrisWheel, Brain } from "lucide-react";

const tools = [
  {
    title: "AI Notes Summarizer",
    desc: "Upload notes (PDF or image). Get concise summaries.",
    icon: <FileText className="w-6 h-6 text-yellow-500" />,
    colorBg: "bg-yellow-50",
    accent: "#F1C40F",
    path: "/desk/summarizer",
  },
  {
    title: "Mock Questions Generator",
    desc: "Generate 5-10 crisp exam-style questions from notes.",
    icon: <Edit3 className="w-6 h-6 text-blue-500" />,
    colorBg: "bg-blue-50",
    accent: "#3498DB",
    path: "/desk/mock",
  },
  {
    title: "MCQ Generator",
    desc: "Create 5-10 multiple-choice questions (A-D).",
    icon: <List className="w-6 h-6 text-green-500" />,
    colorBg: "bg-green-50",
    accent: "#2ECC71",
    path: "/desk/mcq",
  },
  {
    title: "Important Qs from PYQs",
    desc: "Upload up to 5 PYQs — get important recurring questions.",
    icon: <RotateCw className="w-6 h-6 text-purple-500" />,
    colorBg: "bg-purple-50",
    accent: "#9B59B6",
    path: "/desk/important",
  },
  {
    title: "Revision Roulette",
    desc: "Spin a wheel of topics to force recall & revision.",
    icon: <FerrisWheel className="w-6 h-6 text-pink-500" />,
    colorBg: "bg-pink-50",
    accent: "#E91E63",
    path: "/desk/roulette",
  },
  /**{
    title: "Auto-Generated Quiz",
    desc: "Get AI-powered quizz tailored to your subjects for smarter exam prep.",
    icon: <Brain className="w-6 h-6 text-yellow-800" />,
    colorBg: "bg-red-50",
    accent: "#E74C3C",
    path: "/desk/motivation",
  },**/
];

export default function Desk() {
  return (
    <div className="min-h-screen p-10 bg-gray-50">
      {/* Page Header */}
      <h1 className="text-4xl font-extrabold text-[#1B4F72] mb-4">
        🛠️ Prep. <span className="text-[#F1C40F]">Tools</span>
      </h1>
      <p className="text-gray-700 mb-12 max-w-2xl">
        Use these <strong>different tools</strong> to be ready for <strong>the exam</strong> without taking any stress.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((t) => (
          <Link
            to={t.path}
            key={t.title}
            className="group block rounded-xl p-6 shadow hover:shadow-lg transition bg-white border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${t.colorBg}`}>{t.icon}</div>
              <div>
                <h3
                  className="text-lg font-semibold"
                  style={{ color: t.accent }}
                >
                  {t.title}
                </h3>
                <p className="text-gray-600 mt-1">{t.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
